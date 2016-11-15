module.exports = {
  methods: {
    changeDialog(dialogName){
      this.$emit('changedialog', dialogName);
    },
    changePage(pageName){
      this.$emit('changepage', pageName);
    },
    closeDialog(){
      this.$emit('changedialog','close');
    }
  }
};
