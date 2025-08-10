// src/migrations/001_initialize_blog_database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
export async function beginInitialize() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Creating tables...');
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
        // Insert some sample categories
        await client.query(`
            INSERT INTO categories (name) VALUES 
            ('Technology'),
            ('Lifestyle'),
            ('Travel'),
            ('Food'),
            ('Health')
            ON CONFLICT (name) DO NOTHING
        `);
        console.log('✓ Sample categories inserted');
        await client.query('COMMIT');
        console.log('🎉 Migration completed successfully!');
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
        throw error;
    }
    finally {
        client.release();
        await pool.end();
    }
}
export async function emptyDatabase() {
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
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('emptying database failed:', error);
        throw error;
    }
    finally {
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
            console.log('Migration rolled back');
            process.exit(0);
        })
            .catch(err => {
            console.error('Rollback error:', err);
            process.exit(1);
        });
    }
    else {
        emptyDatabase()
            .then(() => {
            console.log('Migration completed');
            process.exit(0);
        })
            .catch(err => {
            console.error('Migration error:', err);
            process.exit(1);
        });
    }
}
//# sourceMappingURL=001_initialize_blog_database.js.map