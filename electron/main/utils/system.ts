import { execSync } from 'child_process';
import treeKill from 'tree-kill';
import os from 'os';
import { checkPortStatus } from 'portscanner';

// 检测端口是否被占用
export const getPortInfo = (port: number) => {
  const platform = os.platform();
  return new Promise((resolve, reject) => {
    if (platform === 'win32') {
      const order = `netstat -ano | findstr ${port}`;
      try {
        const stdout = execSync(order);
        const portInfo = stdout.toString().trim().split(/\s+/);
        const pId = portInfo.length >= 4 ? portInfo[4] : '';
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
      if(err) reject(err);
      resolve(true);
    });
  });
}

export const checkPort = (port: number) => {
  return new Promise((resolve, reject) => {
    checkPortStatus(port, "127.0.0.1", (error, status) => {
      if (error) {
        reject(error);
      } else {
        // console.log(`Port ${port} is ${status}`);
        if(status == "open") {
          resolve(false);
        } else if(status == "closed") {
          resolve(true);
        } else {
          reject(status);
        }
      }
    });
  });
};

export const getAvailablePort = (port: number): Promise<number> => {
  return new Promise(async (resolve, reject)=> {
    try {
      const res = await checkPort(port);
      if(res) {
        resolve(port);
      } else {
        const data: any = await getPortInfo(port);
        if(data.pName.indexOf('Partner48') > -1) {
          const d = await killPort(data.pId);
          if(d) {
            resolve(port);
          } else {
            const newPort = await getAvailablePort(port + 1);
            resolve(newPort);
          }
        } else {
          const newPort = await getAvailablePort(port + 1);
          resolve(newPort);
        }
      }
    } catch(err) {
      reject(err);
    }
  });
}

export const checkAndOperatePorts = (ports: number[]) => {
  return new Promise(async (resolve, reject) => {
    try{
      let result = [];
      for(const port of ports) {
        let newValue = await getAvailablePort(port);
        while (result.includes(newValue)) {
          newValue = await getAvailablePort(port + 1);
        }
        result.push(newValue);
      }
      resolve(result);
    } catch(e) {
      reject(e)
    }
  });
}