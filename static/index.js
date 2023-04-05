const container = document.getElementById("container") ?? null;

const template = `
{{#if showList}}
  <h4>Products:</h4>
  <div>
    <div>
      {{#each list}}
        <div>
          <div>
            <div>
              <h5>{{this.title}}</h5>
              <p>{{this.description}}</p>
            </div>
            <ul>
              <liItem {{this.ref}}</li>
              <liPrice: {{this.price}}</li>
              <liStock: {{this.stock}}</li>
            </ul>
          </div>
        </div>
      {{/each}}
    </div>
  </div>
{{else}}
  <p>Sin Products...</p>
{{/if}}
`;

const compileTemplate = Handlebars.compile(template);

serverSocket.on("updateList", (data) => {
  if (container !== null) {
    container.innerHTML = compileTemplate({
      headerTitle: "Home | Products",
      mainTitle: "List of products in Real Time",
      list: data.list,
      showList: data.showList,
    });
  }
});
