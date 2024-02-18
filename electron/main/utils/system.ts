import { execSync } from 'child_process';
import treeKill from 'tree-kill';
import os from 'os';
import { createServer } from 'net';

// 检测端口是否被占用
export const getPortInfo = (port: number) => {
  const platform = os.platform();
  return new Promise((resolve, reject) => {
    if (platform === 'win32') {
      const order = `netstat -ano | findstr ${port}`;
      try {
        const stdout = execSync(order);
        const portInfo = stdout.toString().trim().split(/\s+/);
        const pId = portInfo[portInfo.length - 1];
        const processStdout = execSync(`tasklist | findstr  ${pId}`);
        const [pName] = processStdout.toString().trim().split(/\s+/);
        resolve({
          pId,
          pName,
        });
      } catch (error) {
        reject(error);
      }
    } else {
      const order = `lsof -i:${port}`;
      try {
        const stdout = execSync(order);
        const [pName, pId] = stdout
          .toString()
          .trim()
          .split(/\n/)[1]
          .split(/\s+/);
        resolve({
          pId,
          pName,
        });
      } catch (error) {
        reject(error);
      }
    }
  });
}

export const killPort = (pid: number) => {
  return new Promise((resolve,reject) => {
    treeKill(pid, 'SIGKILL', function(err) {
      if(err) reject;
      resolve;
    });
  });
}

export const checkPort = (port: number) => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', (error: any) => {
      console.log(error.code)
      if (error.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        reject(error);
      }
    });
    server.once('listening', () => {
      // console.log(`Port ${port} is available`);
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

export const checkAndKillPort = (ports: number[]) => {
  return Promise.all(ports.map(port => {
    return new Promise((resolve, reject) => {
      checkPort(port).then((res: any) => {
        console.log('checkPort',  port);
        if(res) {
          resolve;
        } else {
          getPortInfo(port).then((data: any) => {
            if(data.pId) {
              console.log('killPort', data.pId);
              killPort(data.pId).then(d => {
                resolve;
              });
            }
          });
        }
      }).catch(err => {
        reject(err);
      });;
    });
  }))
  ports.forEach(port => {
    checkPort(port).then((res: any) => {
      if(!res) {
        getPortInfo(port).then((data: any) => {
          if(data.pId) {
            killPort(data.pId);
          }
        })
      }
    }).catch(err => {
      console.log(err);
    });
  });
}