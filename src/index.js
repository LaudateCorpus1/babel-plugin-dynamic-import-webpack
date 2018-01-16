import template from 'babel-template';
import syntax from 'babel-plugin-syntax-dynamic-import';

const buildImport = template(`
  (new Promise((resolve, reject) => {
    require.ensure([], (require) => {
      try {
        resolve(require(SOURCE));
      } catch (err) {
        reject(err);
      }
    });
  }))
`);

export default () => ({
  inherits: syntax,

  visitor: {
    Import(path) {
      const newImport = buildImport({
        SOURCE: path.parentPath.node.arguments,
      });
      path.parentPath.replaceWith(newImport);
    },
  },
});
