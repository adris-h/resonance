let editMode = true;

const editButton = document.getElementById('edit-button');

function enableEditMode() {
    if (editButton) {
        editButton.addEventListener('click', () => {
            editMode = !editMode;
            console.log(editMode);
            return editMode;
        })
    }
}

