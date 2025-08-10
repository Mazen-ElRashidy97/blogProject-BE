import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
export const signUpUserToDatabase = async (name, email, password) => {
    const client = await pool.connect();
    try {
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email;';
        const values = [name, email, password];
        const result = await client.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error('Database error:', error);
        throw new Error('Database operation failed');
    }
    finally {
        client.release();
    }
};
export const getUserFromDatabase = async (email, password) => {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM users where email = $1`;
        const user = await client.query(query, [email]);
        if (user.rows.length === 0)
            throw new Error('User not found');
        return user.rows[0];
    }
    catch (error) {
        console.log('Database no user email match: ', error);
        throw new Error('Database operation login failed');
    }
    finally {
        client.release();
    }
};
//# sourceMappingURL=database.js.map