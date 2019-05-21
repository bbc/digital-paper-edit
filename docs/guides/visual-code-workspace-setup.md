# Visual Code Workspace - draft

**Optionally** you can use [multi root VS Code Workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces)

**Pre-requisite** 
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node](https://nodejs.org/en/download/)


Some quick instructions to get setup, feedback to make this onboarding 

git clone these repos 
- [`bbc/digital-paper-edit-client`](https://github.com/bbc/digital-paper-edit-client)
- [`bbc/digital-paper-edit-api`](https://github.com/bbc/digital-paper-edit-api)
- [`bbc/digital-paper-edit-infrastructure`](https://github.com/bbc/digital-paper-edit-infrastructure)
- [`/bbc/digital-paper-edit-electron`](https://github.com/bbc/digital-paper-edit-electron) 
- [`bbc/digital-paper-edit-cep`](https://github.com/bbc/digital-paper-edit-cep) 


Copy and paste this in your terminal to download all the repositories

```
git clone git@github.com:bbc/digital-paper-edit-client.git 
git clone git@github.com:bbc/digital-paper-edit-api.git  
git clone git@github.com:bbc/digital-paper-edit-electron.git  
git clone git@github.com:bbc/digital-paper-edit-infrastructure.git  
git clone git@github.com:bbc/digital-paper-edit-cep.git 
```


Create a file named `digital-paper-edit.code-workspace` in the same root where you have cloned the repositories, and add this json as content

```json
{
    "folders": [
        {
            "name": "React Client",
            "path": "digital-paper-edit-client"
        },
        {
            "name": "Server API",
            "path": "digital-paper-edit-api"
        },
        {
            "name": "Electron",
            "path": "digital-paper-edit-electron"
        },
         {
            "name": "Adobe CEP",
            "path": "digital-paper-edit-cep"
        },
         {
            "name": "AWS Infrastructure",
            "path": "digital-paper-edit-infrastructure"
        }
    ],

}
```


double clicking `digital-paper-edit.code-workspace` will open the workspace.