import authRouter from './auth';
import roleRouter from './role';
import postRouter from './post';
import tagRouter from './tag';
import postTagRouter from './post-tag';
import supportRouter from './support';
import statusActivityRouter from './status-activity';
import userRouter from './user';
import friendRouter from './friend';
import documentShareRouter from './document-share';
import cmtDocumentRouter from './cmt-document';
import commentRouter from './comment';
import reactionRouter from './reaction';
import conversationRouter from './conversation';
import markPostRouter from './mark-post';
import mediaRouter from './media';
import messagerRouter from './messager';
import nationRouter from './nation';
import userNotificationRouter from './user-noti';
import pageRouter from './page';
import storyRouter from './story';
import userSocialRouter from './user-social';

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
    app.use('/api/v1/document-shares', documentShareRouter);
    app.use('/api/v1/cmt-documents', cmtDocumentRouter);
    app.use('/api/v1/comments', commentRouter);
    app.use('/api/v1/reactions', reactionRouter);
    app.use('/api/v1/conversations', conversationRouter);
    app.use('/api/v1/mark-posts', markPostRouter);
    app.use('/api/v1/medias', mediaRouter);
    app.use('/api/v1/messagers', messagerRouter);
    app.use('/api/v1/nations', nationRouter);
    app.use('/api/v1/user-notifications', userNotificationRouter);
    app.use('/api/v1/pages', pageRouter);
    app.use('/api/v1/stories', storyRouter);
    app.use('/api/v1/user-socials', userSocialRouter);

    return app.use('/', (req, res) => {
        res.send('server on...')
    })
}

export default initRoutes;