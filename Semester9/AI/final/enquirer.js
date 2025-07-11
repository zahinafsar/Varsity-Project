const { prompt } = require('enquirer');

prompt({
  type: 'input',
  name: 'matrix',
  message: 'Enter adjacency matrix (rows separated by semicolons, elements by spaces):',
  validate: input => {
    try {
      const matrix = input.split(';').map(row => row.trim().split(' ').map(Number));
      const size = matrix.length;
      if (!matrix.every(row => row.length === size)) {
        return 'Matrix must be square';
      }
      if (!matrix.every(row => row.every(el => el === 0 || el === 1))) {
        return 'Matrix must contain only 0s and 1s';
      }
      return true;
    } catch (e) {
      return 'Invalid matrix format. Use semicolons between rows and spaces between elements';
    }
  }
})
.then(answer => {
  const matrix = answer.matrix.split(';').map(row => row.trim().split(' ').map(Number));
  console.log('Adjacency Matrix:', matrix);
});