let mode="login", filter="all", currentUser=localStorage.getItem("todoCurrentUser");
const authView=document.querySelector("#authView"),todoView=document.querySelector("#todoView");
const authForm=document.querySelector("#authForm"),email=document.querySelector("#email"),password=document.querySelector("#password");
const authButton=document.querySelector("#authButton"),authMessage=document.querySelector("#authMessage");
const loginTab=document.querySelector("#loginTab"),registerTab=document.querySelector("#registerTab");
const logoutButton=document.querySelector("#logoutButton"),userEmail=document.querySelector("#userEmail");
const taskForm=document.querySelector("#taskForm"),taskInput=document.querySelector("#taskInput"),taskList=document.querySelector("#taskList");
const count=document.querySelector("#count"),clearCompleted=document.querySelector("#clearCompleted");

loginTab.onclick=()=>setMode("login"); registerTab.onclick=()=>setMode("register");
function setMode(m){mode=m;loginTab.classList.toggle("active",m==="login");registerTab.classList.toggle("active",m==="register");authButton.textContent=m==="login"?"Login":"Register";authMessage.textContent=""}

authForm.onsubmit=e=>{
 e.preventDefault();
 const u=email.value.trim(),p=password.value;
 if(!u||!p)return;
 if(mode==="register"){
   const users=JSON.parse(localStorage.getItem("todoUsers")||"{}");
   users[u]=p;localStorage.setItem("todoUsers",JSON.stringify(users));
   authMessage.style.color="#16803c";authMessage.textContent="Registered! You can login now.";
   setTimeout(()=>setMode("login"),500);
 }else{
   const users=JSON.parse(localStorage.getItem("todoUsers")||"{}");
   if(users[u] && users[u]!==p){authMessage.style.color="#c0392b";authMessage.textContent="Wrong password.";return}
   // Demo mode: any username/password is accepted.
   localStorage.setItem("todoCurrentUser",u);currentUser=u;showTodo();
 }
};
logoutButton.onclick=()=>{localStorage.removeItem("todoCurrentUser");currentUser=null;showAuth()};
function showTodo(){authView.classList.add("hidden");todoView.classList.remove("hidden");userEmail.textContent="Logged in as: "+currentUser;render()}
function showAuth(){authView.classList.remove("hidden");todoView.classList.add("hidden");authForm.reset()}
function key(){return "tasks_"+currentUser}
function getTasks(){return JSON.parse(localStorage.getItem(key())||"[]")}
function saveTasks(t){localStorage.setItem(key(),JSON.stringify(t))}
taskForm.onsubmit=e=>{e.preventDefault();let t=taskInput.value.trim();if(!t)return;let a=getTasks();a.unshift({id:Date.now(),text:t,completed:false});saveTasks(a);taskInput.value="";render()}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()});
function render(){let all=getTasks(),shown=all.filter(t=>filter==="all"||(filter==="active"&&!t.completed)||(filter==="completed"&&t.completed));taskList.innerHTML="";
shown.forEach(t=>{let li=document.createElement("li");li.className="task"+(t.completed?" done":"");let c=document.createElement("input");c.type="checkbox";c.checked=t.completed;c.onchange=()=>{let a=getTasks(),x=a.find(v=>v.id===t.id);x.completed=!x.completed;saveTasks(a);render()};let s=document.createElement("span");s.textContent=t.text;let d=document.createElement("button");d.className="delete";d.textContent="Delete";d.onclick=()=>{saveTasks(getTasks().filter(v=>v.id!==t.id));render()};li.append(c,s,d);taskList.appendChild(li)});
let n=all.filter(t=>!t.completed).length;count.textContent=n+" "+(n===1?"task":"tasks")+" left"}
clearCompleted.onclick=()=>{saveTasks(getTasks().filter(t=>!t.completed));render()};
if(currentUser)showTodo();