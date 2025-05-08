const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jojuambily103:ayan273185@cluster0.do0apjp.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

module.exports = mongoose;
