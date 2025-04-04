import authRouter from './auth';
import roleRouter from './role';
import postRouter from './post';

const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/roles', roleRouter);
    app.use('/api/v1/posts', postRouter);

    return app.use('/', (req, res) => {
        res.send('server on...')
    })
}

export default initRoutes;