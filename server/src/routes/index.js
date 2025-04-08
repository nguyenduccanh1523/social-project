import authRouter from './auth';
import roleRouter from './role';
import postRouter from './post';
import tagRouter from './tag';
import postTagRouter from './post-tag';
import supportRouter from './support';
import statusActivityRouter from './status-activity';
import userRouter from './user';
import friendRouter from './friend';

const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/roles', roleRouter);
    app.use('/api/v1/posts', postRouter);
    app.use('/api/v1/tags', tagRouter);
    app.use('/api/v1/post-tags', postTagRouter);
    app.use('/api/v1/supports', supportRouter);
    app.use('/api/v1/status-activities', statusActivityRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/friends', friendRouter);

    return app.use('/', (req, res) => {
        res.send('server on...')
    })
}

export default initRoutes;