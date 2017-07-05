from base64 import b64encode
import numpy as np
import imageio
import requests

def convert_image(img):
    nchannels = img.shape[-1] if img.ndim == 3 else 1
    if nchannels == 1:
        img = img.repeat(3, axis=1).reshape((*img.shape, 3))

    if np.issubdtype(img.dtype, float):
        if img.max() <= 1:
            img = img * 255.
        img = np.uint8(img)

    return img


class DashboardClient:
    def __init__(self, run_name, hostname):
        self._baseurl = f'http://{hostname}/api'
        self._run_name = run_name

    def _send_request(self, apipath, data):
        ret = requests.post(self._baseurl + apipath, json=data)
        return ret.status_code == 200
    
    def add_scalar(self, name, scalar, step):
        data = {
            'run_name': self._run_name,
            'path': name,
            'scalar': scalar,
            'step': step,
        }
        self._send_request('/add_scalar', data)

    def add_stats(self, name, value, std, step):
        data = {
            'run_name': self._run_name,
            'path': name,
            'value': value,
            'std': std,
            'step': step,
        }
        self._send_request('/add_stats', data)

    def add_image(self, name, img, step):
        '''
        This function draws an img. It takes as input an `HxWxC` or `HxW` tensor
        `img` that contains the image. The array values can be float in [0,1] or
        uint8 in [0, 255].
        '''
        
        img = convert_image(img)
        buf = imageio.imwrite(imageio.RETURN_BYTES, image, format='PNG')
        s = b64encode(buf).decode()
        data = {
            'run_name': self._run_name,
            'path': name,
            'image': s,
            'step': step,
        }
        self._send_request('/add_image', data)

    def add_episode(self, name, episode):
        frames = [convert_image(img) for img in episode]

        COLS = 100

        width = frames[0].shape[1]
        height = frames[0].shape[0]
        steps = len(frames)

        for i in range(COLS - len(frames) % COLS):
            frames.append(frames[-1])
        frames = np.array(frames)
        frames = frames.reshape((frames.shape[0] // COLS, COLS, *frames.shape[1:]))
        frames = np.concatenate(frames, axis=1)
        frames = np.concatenate(frames, axis=1)

        buf = imageio.imwrite(imageio.RETURN_BYTES, frames, format='PNG',
                              optimize=True)
        s = b64encode(buf).decode()

        data = {
            'run_name': self._run_name,
            'path': name,
            'episode': s,
            'steps': steps,
            'width': width,
            'height': height,
        }
        self._send_request('/add_episode', data)

__all__ = [
    'DashboardClient',
]
