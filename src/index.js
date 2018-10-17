import dva from 'dva';
// import createLoading from 'dva-loading';
import './index.css';
import './fixed.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use(createLoading());

// 3. Model
app.model(require('./models/user').default);
app.model(require('./models/base').default);
// app.model(require('./models/socket').default);
// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
