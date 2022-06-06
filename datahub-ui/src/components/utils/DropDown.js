let clickDropdown = (evt, id) => {
    let ele = document.getElementById(id);
    console.log(ele.style.display);
    if (ele.style.display === "none") {
        evt.target.classList.remove("fa-chevron-down");
        evt.target.classList.add("fa-chevron-up");
        ele.style.display = "block";
    } else {
        evt.target.classList.remove("fa-chevron-up");
        evt.target.classList.add("fa-chevron-down");
        ele.style.display = "none";
    }
};
export let clickTableDropdown =(evt,id)=>{
    let ele = document.getElementById(id);
    console.log(ele.style.display);
    if (ele.style.display === "none") {
        ele.style.display = "block";
    }
    else {
        ele.style.display = "none";
    }
}
export default clickDropdown;