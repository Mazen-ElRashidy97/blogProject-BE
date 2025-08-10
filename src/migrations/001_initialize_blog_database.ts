// src/migrations/001_initialize_blog_database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export async function beginInitialize(): Promise<void> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('Creating tables...');
// /*
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `);
        console.log('✓ Users table created');

        // Create categories table
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE
            )
        `);
        console.log('✓ Categories table created');

        // Create blogs table with foreign key to users
        await client.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `);
        console.log('✓ Blogs table created');

        // Create blog_categories junction table (many-to-many)
        await client.query(`
            CREATE TABLE IF NOT EXISTS blog_categories (
                blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                PRIMARY KEY (blog_id, category_id)
            )
        `);
        console.log('✓ Blog_categories junction table created');

        // Create indexes for better performance
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_blog_categories_blog_id ON blog_categories(blog_id);
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_blog_categories_category_id ON blog_categories(category_id);
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        `);
        console.log('✓ Indexes created');

        // Insert some sample categories (lowercase)
        await client.query(`
            INSERT INTO categories (name) VALUES 
            ('technology'),
            ('lifestyle'),
            ('travel'),
            ('food'),
            ('health')
            ON CONFLICT (name) DO NOTHING
        `);
        console.log('✓ Sample categories inserted');
        // */ 

/*
        // Insert sample blogs for the user
        const userResult = await client.query(`
            SELECT id FROM users WHERE email = 'mazen@gmail.com'
        `);

        if (userResult.rows.length > 0) {
            const userId = userResult.rows[0].id;

            // Insert blogs
            const blogResult = await client.query(`
                INSERT INTO blogs (title, content, user_id) VALUES 
                ('My First Tech Blog', 'This is a short introduction to modern web development. Today we explore React and Node.js basics.', $1),
                ('Healthy Living Tips', 'Simple ways to stay healthy: drink water, exercise daily, and get enough sleep. Small changes make big differences.', $1),
                ('Weekend Travel Adventure', 'Just returned from an amazing weekend trip to the mountains. The views were breathtaking and the hiking was refreshing.', $1)
                RETURNING id
            `, [userId]);
            console.log('✓ Sample blogs inserted');

            // Get category IDs
            const techCategory = await client.query(`SELECT id FROM categories WHERE name = 'technology'`);
            const healthCategory = await client.query(`SELECT id FROM categories WHERE name = 'health'`);
            const travelCategory = await client.query(`SELECT id FROM categories WHERE name = 'travel'`);

            // Link blogs to categories
            if (blogResult.rows.length >= 3 && techCategory.rows.length > 0 && healthCategory.rows.length > 0 && travelCategory.rows.length > 0) {
                await client.query(`
                    INSERT INTO blog_categories (blog_id, category_id) VALUES 
                    ($1, $2),
                    ($3, $4),
                    ($5, $6)
                `, [
                    blogResult.rows[0].id, techCategory.rows[0].id,
                    blogResult.rows[1].id, healthCategory.rows[0].id,
                    blogResult.rows[2].id, travelCategory.rows[0].id
                ]);
                console.log('✓ Blog categories linked');
            }
        }
*/
        await client.query('COMMIT');
        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

export async function emptyDatabase(): Promise<void> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('Rolling back migration...');

        // Drop tables in reverse order (due to foreign key constraints)
        await client.query('DROP TABLE IF EXISTS blog_categories CASCADE');
        await client.query('DROP TABLE IF EXISTS blogs CASCADE');
        await client.query('DROP TABLE IF EXISTS categories CASCADE');
        await client.query('DROP TABLE IF EXISTS users CASCADE');

        await client.query('COMMIT');
        console.log('✓ Migration rolled back successfully');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('emptying database failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    const command = process.argv[2];

    if (command === 'beginInitialize') {
        beginInitialize()
            .then(() => {
                console.log('Migration completed');
                process.exit(0);
            })
            .catch(err => {
                console.error('Migration error:', err);
                process.exit(1);
            });
    } else {
        emptyDatabase()
            .then(() => {
                console.log('Migration rolled back');
                process.exit(0);
            })
            .catch(err => {
                console.error('Rollback error:', err);
                process.exit(1);
            });
    }
}