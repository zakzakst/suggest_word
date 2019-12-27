new Vue({
  el: '#app',
  data () {
    return {
      texts: null,
      loading: true,
      errored: false
    }
  },
  mounted () {
    axios
      .get('../merge.json')
      .then(response => {
        this.texts = response.data;
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
});
