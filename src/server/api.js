import Router from 'koa-router';

import store from './store';
import logger from './logger';

const router = new Router();

router.post('/add_scalar', async (ctx) => {
  let {run_name, path, scalar, step} = ctx.request.body;
  store.addEvent(run_name, path, { type: 'SCALAR', value: scalar, step });
  ctx.body = {
    hao: 123,
  };
});

router.post('/add_stats', async (ctx) => {
  let {run_name, path, stats, step} = ctx.request.body;
  store.addEvent(run_name, path, { type: 'STATS', value: stats, step });
  ctx.body = {
    hao: 123,
  };
});

router.post('/add_image', async (ctx) => {
  let {run_name, path, image, step} = ctx.request.body;
  store.addEvent(run_name, path, { type: 'IMAGE', image, step });
  ctx.body = {
    hao: 123,
  };
});

router.post('/add_episode', async (ctx) => {
  let {run_name, path, episode, steps, width, height} = ctx.request.body;
  store.addEvent(run_name, path,
                 { type: 'EPISODE', episode, steps, width, height });
  ctx.body = {
    hao: 123,
  };
});


export default router;
