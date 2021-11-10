// importig module
const mongoose = require("mongoose");

// connecting to the database
mongoose.connect("mongodb://localhost:27017/personsDB");

// Schema of fruit
const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    min: 1,
    max: 10,
  },
  review: String,
});

// Model for fruit
const Fruit = mongoose.model("fruits", fruitSchema);

// inserting to fruits collections
const apple = new Fruit({
  name: "Apple",
  rate: 6,
  review: "Awesome Fruit.",
});

const kiwi = new Fruit({
  name: "Kiwi",
  rate: 3,
  review: "I don't like it.",
});

const banana = new Fruit({
  name: "Banana",
  rate: 10,
  review: "Minions Loves it.",
});

const peach = new Fruit({
  name: "Peach",
  rate: 10,
  review: "Everyone loves mango.",
});

// Fruit.insertMany([apple, kiwi, banana, peach], (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Data Inserted Successfully");
//   }
// });

// Fruit.find((err, fruits) => {
//   if (err) {
//     console.log(err);
//   } else {
//     fruits.forEach((fruit) => {
//       console.log(fruit.name);
//       mongoose.connection.close();
//     });
//   }
// });

// Fruit.deleteOne({ _id: "618be7f0e946c3c492a03bc9" }, function (err) {
//   if (err) console.log(err);
// });

// fruit.save();

// schema for people collection
pineapple = Fruit({
  name: "Pine Apple",
  rate: 10,
  review: "Nobody loves mango.",
});
// pineapple.save();
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favouriteFruit: fruitSchema,
});

// Creating model from above schema

const Persons = mongoose.model("Persons", personSchema);

// inserting to person collection
const person = new Persons({
  name: "Amy",
  age: 40,
  favouriteFruit: pineapple,
});

guava = Fruit({
  name: "Guavva",
  rate: 10,
  review: "Nobody loves Guavva.",
});
guava.save();
//
// person.save();
Persons.updateOne(
  { _id: "618bf0655611bf81d0bd6e39" },
  { favouriteFruit: guava },
  function (err) {
    if (err) {
      console.log(err);
    }
    mongoose.connection.close();
  }
);
