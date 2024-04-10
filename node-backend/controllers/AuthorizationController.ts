
// handles requests related to user authorization(login)
export class AuthorizationController {

    // handle user login
    static async login(req: Request, res: Response) {
        try {
            res.status(200).json({'success': 'User has successfully logged in.'});
        } catch (error) {
            console.log('login() Error:', error);
            res.status(500).json({'error': 'Internal server erorr'});
        }
    }
}