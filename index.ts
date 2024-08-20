import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

async function requestAdminPermissions() {
    try {
        // PowerShell command to run a script as administrator
        const command = `
        powershell -Command "Start-Process cmd -ArgumentList '/c, explorer.exe' -Verb runAs"
        `;

        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(stdout);
    } catch (error) {
        console.error(`Failed to request admin permissions: ${error}`);
    }
}

async function unhideProgramDataFolder() {
    try {
        // PowerShell command to unhide the ProgramData folder
        const command = `
        powershell -Command "attrib -h -s C:\\ProgramData"
        `;

        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(`ProgramData folder is now unhidden.\n${stdout}`);
        checkOrgJsonFile()
    } catch (error) {
        console.error(`Failed to unhide ProgramData folder: ${error}`);
    }
}
function checkOrgJsonFile() {
    // Define the path to the Umbrella folder
    const umbrellaFolderPath = path.join('C:', 'ProgramData', 'Cisco', 'Cisco Secure Client', 'Umbrella');
    console.log(umbrellaFolderPath)
    // Define the expected file path
    const orgJsonFilePath = path.join(umbrellaFolderPath, 'OrgInfo.json');
    console.log(orgJsonFilePath)
    // C:\ProgramData\Cisco\Cisco Secure Client\Umbrella
    // Check if the file exists
    if (fs.existsSync(orgJsonFilePath)) {
        console.log('The orgJson file is present.');
    } else {
        console.log('The orgJson file is NOT present.');
    }
}

async function main() {
    await requestAdminPermissions();
    await unhideProgramDataFolder();
    
}

main();
