let isOpen = false;

export function getImportState(){
    return isOpen;
}

export function setImportState(value) {
    isOpen = value;
    console.log(isOpen);
}