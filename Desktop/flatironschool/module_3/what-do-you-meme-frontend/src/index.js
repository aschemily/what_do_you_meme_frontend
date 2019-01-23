let ALLMEMES = []
const API_END = "http://localhost:3000/api/v1/memes"


document.addEventListener('DOMContentLoaded', () => {

  /*****************************************************************************
  * Variables and Data
  *****************************************************************************/
  let addMeme = false
  let editMeme = false
  const memeContainer = document.querySelector('#memes-list')
  const addBtn = document.querySelector('#new-meme-btn')
  const memeForm = document.querySelector('.container')
  const memeTitleInput = document.querySelector('#meme-title-input')
  const memeTextInput = document.querySelector('#meme-text-input')
  const memeImageInput = document.querySelector('#meme-image-input')

  /*****************************************************************************
  * Fetch Onload
  *****************************************************************************/

  fetch(API_END)
  .then(r => r.json())
  .then(memesObj => {
    ALLMEMES = memesObj.data
    memeContainer.innerHTML = renderAllMemes()
  })

  /*****************************************************************************
  * Event Listeners
  *****************************************************************************/

  addBtn.addEventListener('click', () => {
    addMeme = !addMeme
    if (addMeme) {
      memeForm.style.display = 'block'
    } else {
      memeForm.style.display = 'none'
    }
  })

  memeContainer.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'edit') {
      let foundMeme = ALLMEMES.find(meme => {
        return e.target.dataset.id == meme.id
      })
      const meme = document.querySelector('#meme')
      editMeme = !editMeme
      if (editMeme) {
        document.querySelector(`#show-${foundMeme.id}`).style.display = 'block'
      } else {
        document.querySelector(`#show-${foundMeme.id}`).style.display = 'none'
      }
    } else if (e.target.dataset.action === 'delete') {
      let memeToDelete = e.target.dataset.id
      fetch(`${API_END}/${memeToDelete}`, {method: "DELETE"} )
      e.target.parentElement.remove()
    }
  })

  memeContainer.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.value === "Submit") {
      let foundMemeId = e.target.dataset.id
      let editTitleInput = document.querySelector(`#show-${foundMemeId}`).querySelector('#edit-title-input').value
      let editTextInput = document.querySelector(`#show-${foundMemeId}`).querySelector('#edit-text-input').value
      let editImageInput = document.querySelector(`#show-${foundMemeId}`).querySelector('#edit-image-input').value
      fetch(`${API_END}/${foundMemeId}`,{
        method: "PATCH",
        headers:{
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          title: editTitleInput,
          meme_text: editTextInput,
          image: editImageInput
        })
      })
      .then(r => r.json())
      .then((updatedData)=>{
        const foundMeme = ALLMEMES.find(meme => {
          return updatedData.data.id == meme.id
        })
        const indexOfFoundMeme = ALLMEMES.indexOf(foundMeme)
        ALLMEMES[indexOfFoundMeme] = updatedData.data
        document.querySelector(`#meme-${foundMeme.id}`).innerHTML = memeHTML(updatedData.data)
      })
    }
  }) //End of Event Listener

  memeForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    let inputTitle = memeTitleInput.value
    let inputText = memeTextInput.value
    let inputImage = memeImageInput.value
    fetch(API_END, {
      method:"POST",
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body:JSON.stringify({
        title: inputTitle,
        image: inputImage,
        meme_text: inputText,
        user_id: 1
      })
    })
    .then(r => r.json())
    .then(newObj => {
      ALLMEMES.push(newObj.data)
      memeContainer.innerHTML = renderAllMemes()
      window.scrollTo(0,document.body.scrollHeight)
    })
    e.target.reset()
  })

}) //END OF DOM CONTENT LOADED

/*******************************************************************************
* Helper Functions
*******************************************************************************/

const renderAllMemes = () => {
  return ALLMEMES.map(meme => memeHTML(meme)).join('')
}

const memeHTML = (meme) => {
  return `
  <div class="card" id="meme-${meme.id}">
    <h2 style="color: white;" id="meme-title">${meme.attributes.title}</h2>
    <div class="meme-image-container">
      <img class="ui medium image" id="meme-image"src="${meme.attributes.image}">
      <div class="text-block">
        <h3 id="h3-blocks" id="meme-text">${meme.attributes["meme-text"]}</h3>
      </div>
    </div><br>
    <div id="flex-buttons">
      <button data-id="${meme.id}" data-action="edit"type="button">Edit Meme</button>
      <button data-id="${meme.id}" data-action="delete"type="button">Delete Meme</button>
    </div>
    <div class="ui form" style="display: none;" id="show-${meme.id}" class="edit-meme-form" data-id="${meme.id}">
      <div class="fields">
        <div class="field">
          <h3>Edit a Meme!</h3>
          <label style="color: white;" for="edit-meme">Title</label>
          <input id="edit-title-input"type="text" name="name" value="${meme.attributes.title}">
          <br>
          <label style="color: white;" for="edit-meme">Text</label>
          <input id="edit-text-input"type="text" name="name" value="${meme.attributes["meme-text"]}">
          <br>
          <label style="color: white;" for="edit-meme">Image</label>
          <input id="edit-image-input"type="text" name="image" value="${meme.attributes.image}">
          <br>
          <input data-id="${meme.id}" type="submit" name="submit" value="Submit" class="submit">
        </div>
      </div>
    </div>
  </div>`
}
