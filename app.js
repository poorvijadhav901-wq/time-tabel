const days = [
 {name:"Monday",short:"Mon",subtitle:"College + steady GATE preparation",tasks:[
 ["6:00–7:30","Wake up, breakfast, get ready"],["8:00–12:30","College"],["12:30–1:30","Lunch"],["1:30–2:30","Same-day college revision"],["2:30–3:15","Rest"],["3:15–4:30","Assignments / practical records"],["4:30–5:30","Personal time"],["5:30–7:00","GATE preparation"],["7:00–7:30","Break"],["7:30–8:15","GATE practice questions"],["8:15–9:00","Dinner and personal time"],["9:00–9:30","Quick revision / tomorrow's planning"],["9:30 onward","Wind down and sleep"]]},
 {name:"Tuesday",short:"Tue",subtitle:"College + steady GATE preparation",tasks:[
 ["6:00–7:30","Wake up, breakfast, get ready"],["8:00–12:30","College"],["12:30–1:30","Lunch"],["1:30–2:30","Same-day college revision"],["2:30–3:15","Rest"],["3:15–4:30","Assignments / practical records"],["4:30–5:30","Personal time"],["5:30–7:00","GATE preparation"],["7:00–7:30","Break"],["7:30–8:15","GATE practice questions"],["8:15–9:00","Dinner and personal time"],["9:00–9:30","Quick revision / tomorrow's planning"],["9:30 onward","Wind down and sleep"]]},
 {name:"Wednesday",short:"Wed",subtitle:"College + steady GATE preparation",tasks:[
 ["6:00–7:30","Wake up, breakfast, get ready"],["8:00–12:30","College"],["12:30–1:30","Lunch"],["1:30–2:30","Same-day college revision"],["2:30–3:15","Rest"],["3:15–4:30","Assignments / practical records"],["4:30–5:30","Personal time"],["5:30–7:00","GATE preparation"],["7:00–7:30","Break"],["7:30–8:15","GATE practice questions"],["8:15–9:00","Dinner and personal time"],["9:00–9:30","Quick revision / tomorrow's planning"],["9:30 onward","Wind down and sleep"]]},
 {name:"Thursday",short:"Thu",subtitle:"Lab / mini project focus",tasks:[
 ["6:00–7:30","Morning routine"],["8:00–12:30","College"],["12:30–1:30","Lunch"],["1:30–4:30","Lab / Mini Project"],["4:30–5:30","Rest"],["5:30–6:30","College revision"],["6:30–7:30","GATE concepts"],["7:30 onward","Dinner, personal time, light revision"]]},
 {name:"Friday",short:"Fri",subtitle:"Lab / mini project focus",tasks:[
 ["6:00–7:30","Morning routine"],["8:00–12:30","College"],["12:30–1:30","Lunch"],["1:30–4:30","Lab / Mini Project"],["4:30–5:30","Rest"],["5:30–6:30","College revision"],["6:30–7:30","GATE concepts"],["7:30 onward","Dinner, personal time, light revision"]]},
 {name:"Saturday",short:"Sat",subtitle:"AISSD Lab + catch-up + GATE PYQs",tasks:[
 ["8:00–12:30","AISSD Lab"],["12:30–1:30","Lunch"],["1:30–2:30","Lab record / practical work"],["2:30–4:00","Rest"],["4:00–5:00","College backlog"],["5:00–5:30","Break / transition"],["5:30–7:00","GATE PYQs"],["Evening","Personal time"]]},
 {name:"Sunday",short:"Sun",subtitle:"GATE practice + weekly college revision",tasks:[
 ["7:00–8:00","Wake up and breakfast"],["8:00–10:00","GATE preparation"],["10:00–10:30","Break"],["10:30–12:00","GATE practice / test"],["12:00–2:00","Lunch and rest"],["2:00–3:30","College subject revision"],["3:30–4:30","Break"],["4:30–5:30","Mini Project / assignments"],["5:30 onward","Free time and weekly planning"]]}
];
const allocations=[
 ["Monday","CC + PGPUC + DL"],["Tuesday","CC Lab + CNS Lab"],["Wednesday","CNS + PGPUC Lab"],["Thursday","AISSD + CC + DL + CNS Lab"],["Friday","DL + PGPUC + Mini Project"],["Saturday","AISSD Lab + Mini Project"],["Sunday","Revision of all five subjects + ATAR"]
];
const key="gatePlannerV2";
let saved=JSON.parse(localStorage.getItem(key)||"{}");
let selected=0;
function persist(){localStorage.setItem(key,JSON.stringify(saved));}
function taskKey(day,index){return day+"-"+index;}
function render(){
 const tabs=document.getElementById("dayTabs");
 tabs.innerHTML=days.map((d,i)=>`<button class="day-tab ${i===selected?"active":""}" data-day="${i}">${d.short}</button>`).join("");
 tabs.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{selected=+b.dataset.day;render();}));
 const d=days[selected], list=document.getElementById("taskList");
 document.getElementById("dayTitle").textContent=d.name;
 document.getElementById("daySubtitle").textContent=d.subtitle;
 list.innerHTML=d.tasks.map((t,i)=>`<div class="task ${saved[taskKey(selected,i)]?"done":""}"><input type="checkbox" aria-label="Complete ${t[1]}" data-task="${i}" ${saved[taskKey(selected,i)]?"checked":""}><span class="task-time">${t[0]}</span><span class="task-name">${escapeHTML(t[1])}</span><button class="delete-task" title="Delete task" data-delete="${i}">×</button></div>`).join("");
 list.querySelectorAll("input").forEach(c=>c.addEventListener("change",()=>{saved[taskKey(selected,+c.dataset.task)]=c.checked;persist();render();}));
 list.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{d.tasks.splice(+b.dataset.delete,1);persist();render();}));
 document.getElementById("subjectTable").innerHTML=allocations.map(a=>`<tr><td>${a[0]}</td><td>${a[1]}</td></tr>`).join("");
 document.getElementById("dayProgress").textContent=percent(d.tasks,selected)+"%";
 updateStats();
}
function percent(tasks,day){if(!tasks.length)return 0;let done=tasks.filter((_,i)=>saved[taskKey(day,i)]).length;return Math.round(done/tasks.length*100);}
function updateStats(){
 let total=0,done=0;days.forEach((d,i)=>{total+=d.tasks.length;done+=d.tasks.filter((_,j)=>saved[taskKey(i,j)]).length;});
 const today=new Date().getDay(),idx=today===0?6:today-1,td=days[idx];
 document.getElementById("todayPercent").textContent=percent(td.tasks,idx)+"%";
 document.getElementById("todayBar").style.width=percent(td.tasks,idx)+"%";
 document.getElementById("todayCount").textContent=td.tasks.filter((_,j)=>saved[taskKey(idx,j)]).length+" of "+td.tasks.length+" tasks completed";
 document.getElementById("weekPercent").textContent=(total?Math.round(done/total*100):0)+"%";
 document.getElementById("completedCount").textContent=done;
}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("newDay").innerHTML=days.map((d,i)=>`<option value="${i}">${d.name}</option>`).join("");
document.getElementById("addTaskForm").addEventListener("submit",e=>{e.preventDefault();let i=+document.getElementById("newDay").value;days[i].tasks.push([document.getElementById("newTime").value.trim(),document.getElementById("newActivity").value.trim()]);document.getElementById("newTime").value="";document.getElementById("newActivity").value="";selected=i;persist();render();});
const notes=document.getElementById("notes");notes.value=saved.notes||"";notes.addEventListener("input",()=>{saved.notes=notes.value;persist();document.getElementById("saveStatus").textContent="Saved on this device.";});
document.getElementById("todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",year:"numeric"});
render();

// Create a printable weekly report. In the browser print window choose "Save as PDF".
document.getElementById("pdfBtn").addEventListener("click", function () {
  const safe = (value) => escapeHTML(String(value ?? ""));
  let totalTasks = 0;
  let completedTasks = 0;
  days.forEach((day, dayIndex) => {
    totalTasks += day.tasks.length;
    completedTasks += day.tasks.filter((_, taskIndex) => !!saved[taskKey(dayIndex, taskIndex)]).length;
  });
  const weeklyPercent = totalTasks ? Math.round(completedTasks / totalTasks * 100) : 0;
  let report = `
    <h1>GATE + College Weekly Progress Report</h1>
    <p>Generated: ${safe(new Date().toLocaleString())}</p>
    <p><strong>Overall weekly progress: ${weeklyPercent}%</strong> (${completedTasks} of ${totalTasks} tasks completed)</p>
  `;

  days.forEach((day, dayIndex) => {
    const completed = day.tasks.filter((_, taskIndex) => !!saved[taskKey(dayIndex, taskIndex)]).length;
    const percentage = day.tasks.length ? Math.round(completed / day.tasks.length * 100) : 0;
    report += `<h2>${safe(day.name)} — ${percentage}% completed (${completed}/${day.tasks.length})</h2>`;
    report += `<table><thead><tr><th>Time</th><th>Activity</th><th>Status</th></tr></thead><tbody>`;
    day.tasks.forEach((task, taskIndex) => {
      const isDone = !!saved[taskKey(dayIndex, taskIndex)];
      report += `<tr><td>${safe(task[0])}</td><td>${safe(task[1])}</td><td class="${isDone ? "report-done" : ""}">${isDone ? "Completed ✓" : "Not completed"}</td></tr>`;
    });
    report += `</tbody></table>`;
  });

  report += `<h2>Weekly Subject Allocation</h2><table><thead><tr><th>Day</th><th>College revision priority</th></tr></thead><tbody>`;
  allocations.forEach((item) => { report += `<tr><td>${safe(item[0])}</td><td>${safe(item[1])}</td></tr>`; });
  report += `</tbody></table>`;
  report += `<h2>Weekly Reflection Notes</h2><p>${safe(saved.notes || "No reflection notes added.")}</p>`;

  let reportElement = document.getElementById("printReport");
  if (!reportElement) {
    reportElement = document.createElement("div");
    reportElement.id = "printReport";
    document.body.appendChild(reportElement);
  }
  reportElement.innerHTML = report;
  window.print();
});
