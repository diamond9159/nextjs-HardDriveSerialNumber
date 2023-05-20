import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [HDSerialNumber, setHDSerialNumber] = useState('0000000000000');

  const getMachineId = () => {
    let machineId = localStorage.getItem('MachineId');

    if (!machineId) {
      machineId = crypto.randomUUID();
      localStorage.setItem('MachineId', machineId);
    }

    return machineId;
  };

  const getComputerInfo = () => {
    var locator = new ActiveXObject('WbemScripting.SWbemLocator');
    var service = locator.ConnectServer('.');
    var properties = service.ExecQuery('SELECT * FROM Win32_BaseBoard');
    var e = new Enumerator(properties);

    const computerInfo = {};
    document.write('<table border=1>');
    for (; !e.atEnd(); e.moveNext()) {
      var p = e.item();

      console.log(p);

      document.write('<tr>');
      document.write('<td>' + p.HostingBoard + '</td>');
      document.write('<td>' + p.Manufacturer + '</td>');
      document.write('<td>' + p.PoweredOn + '</td>');
      document.write('<td>' + p.Product + '</td>');
      document.write('<td>' + p.SerialNumber + '</td>');
      document.write('<td>' + p.Version + '</td>');
      document.write('</tr>');
    }
    document.write('</table>');
  };

  const getHardDriveSerialNumber = () => {
    return new Promise(function (resolve, reject) {
      const wmi = GetObject('winmgmts:{impersonationLevel=impersonate}');
      const c = new Enumerator(
        wmi.ExecQuery('SELECT SerialNumber FROM Win32_DiskDrive')
      );
      for (; !c.atEnd(); c.moveNext()) {
        const drive = c.item();
        const serial = drive.SerialNumber;
        resolve(serial);
      }
      reject();
    });
  };

  const GetMachineInfo = () => {
    getHardDriveSerialNumber()
      .then((serial) => {
        console.log('Hard Drive Serial Number: ' + serial);
        setHDSerialNumber(serial);
      })
      .catch(() => {
        console.log('Error getting hard drive serial number.');
      });

    const machineId = getMachineId();
    setHDSerialNumber(machineId);
    
    getComputerInfo();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div className={styles.grid}>
          I would like to get Hard drive serial number.
          <button className={styles.card} onClick={() => GetMachineInfo()}>
            Get Serial Number
          </button>
          <code>{HDSerialNumber}</code>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://next.new" target="_blank" rel="noopener noreferrer">
          Created with&nbsp;<b>next.new</b>&nbsp;⚡️
        </a>
      </footer>
    </div>
  );
}
