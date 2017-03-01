//TODO: Create an actual prompt, don't use prompt

export default {
  computed: {
    /* Get the player's name from localStorage. If it's not there, prompt them for it and add it */
    playerName(){
      var name = localStorage.getItem('name');
      if(name) return name;
      name = prompt('Enter your name');
      localStorage.setItem('name', name);
      return name;
    }
  }
}
