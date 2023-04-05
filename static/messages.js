const serverSocket = io("http://localhost:8080");

const form = document.getElementById("formContainer");
const messagesContainer = document.getElementById("messagesContainer");
const submitter = document.getElementById("formButton");
const deleteBtn = document.getElementById("deleteButton");

if (deleteBtn instanceof HTMLButtonElement) {
  deleteBtn.addEventListener("click", handleDelete);

  function handleDelete(event) {
    event.preventDefault();
    fetch("/api/v1/messages", {
      method: "DELETE",
    });
  }
}

if (form instanceof HTMLFormElement && submitter instanceof HTMLButtonElement) {
  form.addEventListener("submit", handleSubmit);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target, submitter);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    fetch("/api/v1/messages", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const template = `
{{#if showList}}
    {{#each list}}
      <li>
      <div>
        <p><italic>{{this.user}}</italic>: {{this.message}}</p>
      </div>
      </li>
    {{/each}}
  {{else}}
    <p>No hay mensajes</p>
  {{/if}}
`;

const compileTemplate = Handlebars.compile(template);

serverSocket.on("messagesList", (data) => {
  if (messagesContainer !== null) {
    messagesContainer.innerHTML = compileTemplate({
      headerTitle: "Messages",
      mainTitle: "Chat in Real Time",
      list: data.list,
      showList: data.showList,
    });
  }
});
