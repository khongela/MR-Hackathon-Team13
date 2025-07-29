const userService = require('../services/userService');

class userController {
    async getAllUsers(req, res, next) {
        try {          
            const users = await userService.getAllUsers();

            if (users) {
                res.json({
                    success: true,
                    data: users
                });
            }

        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            const id = req.params.id;

            const user = await userService.getUserById(id);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

    async getUserEmail(req, res, next) {
        try {
            const email = req.params.email;

            const user = await userService.getUserById(email);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

    async patchUserName(req, res, next) {
        try {
            
            const id = req.params.id;
            const name = req.params.name;

            const user = await userService.patchUserName(id,name);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }
    
    async patchUserEmail(req, res, next) {
        try {
            
            const id = req.params.id;
            const email= req.params.email;

            const user = await userService.patchUserEmail(id,email);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }
      
    async patchUserPassword(req, res, next) {
        try {
            
            const id = req.params.id;
            const password = req.params.password;

            const user = await userService.patchUserPassword(id,password);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }

    async patchUserAddress(req, res, next) {
        try {
            
            const id = req.params.id;
            const address = req.params.address;

            const user = await userService.patchUserAddress(id,address);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }
    
    
    async putUserDetails(req, res, next) {
        try {
            
            const {id,email,password,address,name} = req.body;
            const user = await userService.putUserDetails(id,email,password,address,name);

            res.json({
                success: true,
                data: user
            });
                
        } catch (error) {
            next(error);
        }
    }
    // async postNewUser(req, res, next) {
    //     try {
            
    //         const {uid,email,displayName} = req.body;
    //         const user = await userService.postNewUser(uid,email,displayName);

    //         res.json({
    //             success: true,
    //             data: user
    //         });
                
    //     } catch (error) {
    //         next(error);
    //     }
    // }

}

module.exports = new userController();