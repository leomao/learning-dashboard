module.exports = ({ file, options, env }) => ({
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-cssnext': {},
    'cssnano': { autoprefixer: false }
  }
});
