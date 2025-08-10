import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { BlogDataBody, BlogDataBodyUpdate, UserModel } from '../models/models';
import ca from 'zod/v4/locales/ca.js';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export const signUpUserToDatabase = async (name: string, email: string, password: string) => {
    const client = await pool.connect();
    try {
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email;';
        const values = [name, email, password];
        const result = await client.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Database operation failed');
    } finally {
        client.release();
    }
}

export const getUserFromDatabase = async (email: string, password: string): Promise<UserModel> => {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM users where email = $1`;
        const user = await client.query(query, [email]);

        if (user.rows.length === 0) throw new Error('User not found');

        return user.rows[0];

    } catch (error) {
        console.log('Database no user email match: ', error);
        throw new Error('Database operation login failed')
        ;
    } finally {
        client.release();
    }
}

export const getBlogsFromDatabase = async (categories?: string[]) => {
    const client = await pool.connect();
    try {
        let result;
        if (categories && categories.length > 0) {
            const query = `
                SELECT DISTINCT b.*
                FROM blogs b
                INNER JOIN blog_categories bc ON b.id = bc.blog_id
                INNER JOIN categories c ON bc.category_id = c.id
                WHERE c.name = ANY($1);
            `;
            result = await client.query(query, [categories]);

            if (!result.rows) throw new Error('No blogs found for the specified categories');

            return result.rows;
        }

        // If no categories are provided, fetch all blogs
        const query = 'SELECT * FROM blogs';
        result = await client.query(query);

        return result.rows;

    } catch (error: any) {
        console.error('Database Fetching blogs failed:', error);
        throw new Error('Fetching blogs failed');
    } finally {
        client.release();
    }
}

export const addBlogInDatabase = async (userId: number, blogData: BlogDataBody) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // First query add blog
        const blogQuery = 'INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3) RETURNING id, title, content, user_id;';
        const values = [blogData.title, blogData.content, userId];
        const result = await client.query(blogQuery, values);

        // second query add new category if there is any to the categories table
        const blogId = result.rows[0].id;
        const categoryQueries = blogData.category.map(async (category: string) => {
            const categoryQuery = 'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id;';
            const categoryResult = await client.query(categoryQuery, [category]);
            let categoryId = categoryResult.rows[0]?.id;

            if (!categoryId) {
                const categoryQueryId = 'SELECT id FROM categories WHERE name = $1;';
                const categoryIdResult = await client.query(categoryQueryId, [category]);
                categoryId = categoryIdResult.rows[0]?.id;
            }

            // third query add blog id and category id in blog_categories table
            const blogCategoryQuery = 'INSERT INTO blog_categories (blog_id, category_id) VALUES ($1, $2);';
            await client.query(blogCategoryQuery, [blogId, categoryId]);

        });
        await Promise.all(categoryQueries);

        if (process.env.ROLLBACK_ADD_BLOG === 'true') await client.query('ROLLBACK'); // To Debug

        // Reset the sequence for blogs and categories if in development mode
        if (process.env.NODE_ENV === 'development') {
            await client.query(`SELECT setval('blogs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM blogs))`);
            await client.query(`SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories))`);
        }

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        console.error('Database Adding blog failed:', error);
        throw new Error('Adding blog failed');

    } finally {
        client.release();
    }

}

export const updateBlogInDatabase = async (userId: number, blogData: BlogDataBodyUpdate) => {
    const client = await pool.connect();
    try {

        await client.query('BEGIN');

        // Check if the blog exists and belongs to the user
        const checkBlogQuery = 'SELECT * FROM blogs WHERE id = $1 AND user_id = $2;';
        const checkResult = await client.query(checkBlogQuery, [blogData.blogId, userId]);
        if (checkResult.rowCount === 0) {
            throw new Error('Blog not found or does not belong to the user');
        }

        // First update query with given id
        const blogQuery = 'UPDATE blogs SET title = $1, content = $2, updated_date = NOW() WHERE id = $3 RETURNING id, title, content, user_id;';
        const values = [blogData.title, blogData.content, blogData.blogId];
        const result = await client.query(blogQuery, values);

        // second update categories if new categories are provided and get the ids of the categories
        const blogId = result.rows[0].id;
        const categoryResults = await Promise.all(
            blogData.category.map(async (category: string) => {

                // Insert new category if it doesn't exist
                const insertCategoryQuery = 'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id;';
                const insertResult = await client.query(insertCategoryQuery, [category]);

                let categoryId = insertResult.rows[0]?.id;

                if (!categoryId) {
                    const selectQuery = 'SELECT id FROM categories WHERE name = $1;';
                    const selectResult = await client.query(selectQuery, [category]);
                    categoryId = selectResult.rows[0]?.id;
                }

                return categoryId;
            })
        );

        console.log('mazenArray', categoryResults);

        // Remove rows for that blog_ id
        const removeBlogCategory = `DELETE FROM blog_categories WHERE blog_id = $1;`;

        await client.query(removeBlogCategory, [blogId]);

        // add the new categories for the blog in blog_categories table
        const blogCategoryQueries = categoryResults.map(async (categoryId: number) => {
            const blogCategoryQuery = 'INSERT INTO blog_categories (blog_id, category_id) VALUES ($1, $2);';
            await client.query(blogCategoryQuery, [blogId, categoryId]);
        });

        await Promise.all(blogCategoryQueries);


        if (process.env.ROLLBACK_ADD_BLOG === 'true') await client.query('ROLLBACK'); // To Debug

        // Reset the sequence for blogs and categories if in development mode
        if (process.env.NODE_ENV === 'development') {
            await client.query(`SELECT setval('blogs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM blogs))`);
            await client.query(`SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories))`);
        }

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {
        console.error('Database Updating blog failed:', error);
        throw new Error('Updating blog failed');

    } finally {
        client.release();
    }

}

export const deleteBlogInDatabase = async (userId: number, blogId: number) => {
    const client = await pool.connect();
    try {
        const deleteBlogQuery = 'DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING *;';
        const result = await client.query(deleteBlogQuery, [blogId, userId]);

        if (result.rowCount === 0) throw new Error('Blog not found for this user');

        return result.rows[0];
    } catch (error) {
        console.error('Database Deleting blog failed:', error);
        throw new Error('Deleting blog failed');
    } finally {
        client.release();
    }
};

