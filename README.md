# Project for Comp229 Sec002 Group2

MERN Skeleton with our logo.

## Setup Instruction:

### Initialize your project

1. In your terminal, go to the folder to store the working files.
2. Clone (Checout/Download) the project files with the following command:

```shell
git clone https://github.com/hongchit/comp229sec002group2.git
```

stephanie santos 03242024

3. Copy the file `client/.env.template` as `client/.env`
4. Edit the new file `client/.env`, and update the MONGODB_URI connection string
5. Execute `yarn install` in the project root folder and the `client` folder
6. Start with `yarn dev` and check if it works.

### Initialize MongoDB with default records

1. Open browser and visit the following URLs:
   - `http://localhost:3000/api/initData/users`
   - `http://localhost:3000/api/initData/courses`
2. Check your MongoDB and verify the valuees.
3. Check the file user.controller.js in the function initData() for user details being created.

Note: Add the parameter `clear=true` to clear existing records before adding default records.
i.e. `http://localhost:3000/api/initData/users?clear=true`
`http://localhost:3000/api/initData/courses?clear=true`

#NOTE - Tested by victor, need to run clear first before init user data

## Notes

1. Use `yarn` instead of `npm` in this project, especially for package management.
2. VSCode may propmt you to download/enable the following modules for easier editing, such as fixing formatting right after saving your files.

- vscode-eslint
- auto-rename-tag
- vscode-styled-components

## Changes from Week9 sample code

1. Use `dotenv` for environment variable (Vite config has to be fixed and not supported yet)
2. Added `.vscode` for VSCode settings (extensions, auto-formatting on file save, etc)
3. Logo file name.

---

---

# Notes

## MongoDB Schema

- Assume a user can be either teacher or student. Cannot be both
- All students will attend each course

# Sample Users

| Role      | Name    | Email                 | Password |
| --------- | ------- | --------------------- | -------- |
| Professor | Esther  | esther@professor.com  | esther   |
| Professor | Madison | madison@professor.com | madison  |
| Professor | Tahlia  | tahlia@professor.com  | tahlia   |
| Student   | Gloria  | gloria@student.com    | gloria   |
| Student   | Wilson  | wilson@student.com    | wilson   |
| Student   | Cynthia | cynthia@student.com   | cynthia  |

## Changes from Week 10

1. Updated Project2
