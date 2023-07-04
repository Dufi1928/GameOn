import axios from 'axios';
import { handleSubmit } from './loginUtils';

describe('handleSubmit', () => {

    it('should handle successful login', async () => {
        const email = 'test@gmail.com';
        const password = '040998';

        jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: { jwt: 'mockJwt' } });

        const result = await handleSubmit(email, password);

        expect(result.jwt).toEqual('mockJwt');
    });

    it('should handle login error', async () => {
        const email = 'test@example.com';
        const password = 'incorrectPassword';

        jest.spyOn(axios, 'post').mockRejectedValueOnce({
            response: { data: { email: 'Email or password is incorrect' } },
        });

        await expect(handleSubmit(email, password)).rejects.toThrow(
            'An error occurred during login'
        );
    });
});
