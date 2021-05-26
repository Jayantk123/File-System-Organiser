#!/usr/bin/env node
const { Console } = require("console");




let inputArr = process.argv.slice(2);  //for get input  ...input taken start from 2nd position bcz at 1st position file name is present
let path = require('path');
let fs = require('fs');
const { mainModule } = require("process");


// current filename...function(tree,organise,help)...new folder name....folder path


// files extension
let types = {
    video : ['mp4','mkv'],
    images : ['jpg','png','gif','jpeg'],
    archives : ['rar','zip'],
    documents : ['docx','doc','pdf','xlsx','xls','ods','odp','txt','tex'],
    app : ['exe','dmg','pkg','deb']
    }


let command = inputArr[0];
// take input ex..  main.js---help -[0]---"directory path-[1]"




// tree organise  help
switch (command) {
    case "tree":
        treefs(inputArr[1]);
        break;

    case "organise":
        organisefs(inputArr[1]);
        break;

    case "help":
        helpfs(inputArr[1]);
        break;

    default:
        console.log("Please Enter correct detail");
        break;
}

// tree function
function treefs(dirPath) {
    
    // 1 input-> directory path
    if (dirPath == undefined) //if you have not passed directory path then it will return undefined
    {
        treesync(process.cwd(),"");    //if undefined then used current working directory
        // console.log("Please enter correct path");
        return;
    }
    else {
        let doesex = fs.existsSync(dirPath);  //jo path pass kra h wo exist krta h to usi m folder bnega

        if (doesex) {
           
            treesync(dirPath,"");
          
            }
            else {
                console.log("Please enter correct path");
                return;
            }
        }
    
   }


function treesync(dirPath,indent)
{
//    check is it file or folder
//if file then print

let isFile = fs.lstatSync(dirPath).isFile();

if(isFile==true)
{
    let filename = path.basename(dirPath);
    console.log(indent+"├──"+filename);
}
// if not file then print folder/directory loop for all its child 
else{
     let dirname = path.basename(dirPath);
     console.log(indent+"──"+dirname);
     let children = fs.readdirSync(dirPath);
     for(let i=0;i<children.length;i++)
     {
         let childpath = path.join(dirPath,children[i]);
         treesync(childpath,indent+"\t");
     }
}

}

 //help function
 function helpfs() {
  console.log("Help command implementes \n\t node main.js tree \n \t node main.js organise \n\t node main.js help");
    
}


// organise function
function organisefs(dirPath) {
    let destp;
    // 1 input-> directory path
    if (dirPath == undefined) //if you have not passed directory path then it will return undefined
    {
           dirPath=process.cwd();
          
           

        // console.log("Please enter correct path");
       
    }
   
        let doesex = fs.existsSync(dirPath);  //jo path pass kra h wo exist krta h to usi m folder bnega

        if (doesex) {
            // 2 create a new directory that store all organise files
            destp = path.join(dirPath, "Organised_files");

            if (fs.existsSync(destp) == false) //if new folder is not exist then create 
            {
                fs.mkdirSync(destp);
            }
            else {
                console.log("Folder already exist");
                return;
            }
        }
    
    organiseFile(dirPath, destp);
   
}

//    organise file function...read directory 
function organiseFile(src, des) {

    // 3 identify category of all files present n that directory
 let childname = fs.readdirSync(src);
    // console.log(childname);


    // required child address to organise file
    for(let i=0;i<childname.length;i++)
    {
    let childadd = path.join(src,childname[i]);  //address le lya
let isFile = fs.lstatSync(childadd).isFile();   //is it file or folder...only file required for organisation

if(isFile)
{
    // console.log(childname[i]);
  let category = getCategory(childname[i]);
    
     console.log(childname[i],"belongs to --> ",category);
      // 4 copy/cut files to that organsie means jo file jis folder m jana chye usme jae// that category folder

      sendfile(childadd,des,category); //child ka address lya nye wale folder ka destination lya according to their extension and put them in their folder

}

    }
}


function sendfile(srcFilePath,destination,category)
{
    //  make srcfile+category path
    let categoryPath = path.join(destination,category);

    // if this path is not exist
    if(fs.existsSync(categoryPath)==false)
    {
        // then make folder in this path
        fs.mkdirSync(categoryPath);
    }

    let filename = path.basename(srcFilePath); //file name accordinng to their extension
    let destfilepath = path.join(categoryPath,filename); 
    fs.copyFileSync(srcFilePath,destfilepath);
    fs.unlinkSync(srcFilePath); //cut option remove file from original path
    console.log(filename," copies to",destfilepath);
}

// this funcn gives extenion and we organise file
function getCategory(name)
{
  let ext = path.extname(name);
//   extension start with .ext
// remove . with slice

ext = ext.slice(1);

for(let type in types)
{
    let ctypearr = types[type];

    for(let i=0;i<ctypearr.length;i++)
    {
        if(ext==ctypearr[i])
        {
return type;
        }
    }
}

// console.log(ext);
return "other";
}




