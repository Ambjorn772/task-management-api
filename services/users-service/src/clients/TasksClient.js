const http = require('http');

class TasksClient {
  constructor(tasksServiceUrl = 'http://localhost:3001') {
    this.tasksServiceUrl = tasksServiceUrl;
  }

  async getTasksByUserId(userId) {
    return new Promise((resolve, reject) => {
      const url = `${this.tasksServiceUrl}/tasks/user/${userId}`;

      http
        .get(url, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              if (res.statusCode === 200) {
                resolve(response.data || []);
              } else {
                reject(new Error(response.error || 'Failed to fetch tasks'));
              }
            } catch (error) {
              reject(new Error('Failed to parse response'));
            }
          });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}

module.exports = TasksClient;

