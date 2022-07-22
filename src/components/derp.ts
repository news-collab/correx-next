import {Connection } from 'typeorm';

interface Person {
  firstName: string;
  lastName: string;
}

console.log(Connection);

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

export default greeter;