const data = require('../../config/database');
const { putUserDetails } = require('../controllers/userController');

class userService {
    async getAllUsers() {
        const query = 'SELECT * FROM "User" ORDER BY id ASC';
        const result = await data.query(query);
        return result.rows;
    }

    async getUserById(id) {
        const query = {
            text: 'SELECT * FROM "User" WHERE id = $1',
            values: [id]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    async getUserByIEmail(email) {
        const query = {
            text: 'SELECT * FROM "User" WHERE email = $1',
            values: [email]
        };

        const result = await data.query(query);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }



    async patchUserName(id,name) {
        const query = {
            text: 'UPDATE "User" SET name = $2 Where id = $1 Returning *',
            values: [id,name]
        };
    
        const result = await data.query(query);
    
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
    
        return result.rows[0];
    }

    async patchUserEmail(id,email) {
        const query = {
            text: 'UPDATE "User" SET email = $2 Where id = $1 Returning *',
            values: [id,email]
        };
    
        const result = await data.query(query);
    
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
    
        return result.rows[0];
    }

    async patchUserPassword(id,password) {
        
        const query = {
            text: 'UPDATE "User" SET password = $2 Where id = $1 Returning *',
            values: [id,password]
        };
    
        const result = await data.query(query);
    
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
    
        return result.rows[0];
    }

        async patchUserAddress(id,address) {
        
        const query = {
            text: 'UPDATE "User" SET address = $2 Where id = $1 Returning *',
            values: [id,address]
        };
    
        const result = await data.query(query);
    
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
    
        return result.rows[0];
    }
    
    async putUserDetails(id,email,password,address,name) {

        const query = {
            text: 'INSERT INTO "User" (id,email,password,address,name) VALUES ($1,$2,$3,$4,$5)',
            values: [id,email,password,address,name]
        };

        try {
            const result = await data.query(query);
    
            return result.rows;
        } catch (error) {
            if (error.code === '23505') {
                return { error: 'User already registered.' };
            }

        return result.rows;
    }
}

    async postNewUser(id,email,password,address,name) {

        const query = {
            text: 'INSERT INTO "User" (id,email,password,address,name) VALUES ($1,$2,$3)',
            values: [id,email,password,address,name]
        };

        try {
            const result = await data.query(query);
    
            return result.rows;
        } catch (error) {
            if (error.code === '23505') {
                return { error: 'User already registered.' };
            }

        return result.rows;
    }

}
    
}

module.exports = new userService();