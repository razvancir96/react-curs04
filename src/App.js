import React from 'react';
import UserList from './components/UserList';
// Importam formularul.
import UserAddForm from './components/UserAddForm';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      background: 'white',
      users: []
    };

    // In cazul in care nu folosim arrow functions la declararea functiilor pasate catre alte componente,
    // ar trebuie sa facem bind in constructor. Ce face bind? Vizitati TEORIA!
    this.BINDED_submitAddForm = this.BINDED_submitAddForm.bind(this);
  }

  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        // Inainte de a actualiza state-ul, filtram userii, astfel incat sa ramanem doar cu primii 3.
        data = data.filter(user => user.id < 4);
        // Pentru fiecare user ramas, ii setam valoarea false pentru cheia isGoldClient
        data.forEach(user => {
          user.isGoldClient = false;
        });
        // Vectorul users din state este populat dupa ce ne vin datele de la API.
        this.setState({users: data});
      })
  }

  changeColor(event) {
    this.setState({background: event.target.value});
    // Observam ca atunci can schimbam background-ul, state-ul afisat este cel precedent, nu cel nou..
    // De ce? setState e asincron, deci nu face modificarea imediat!!
    // Daca vreti sa vedeti cum se modifica state-ul dati console.log-ul in metoda render, pentru ca render
    // este reapelat de fiecare data cand state-ul se schimba!
    console.log(this.state.background);
    // Putem sa ii pasam lui setState un callback ca parametru, dupa pasarea obiectului, pentru a vedea ce se intampla
    // DUPA actualizarea state-ului! (DECOMENTATI codul de mai jos si comentati setState-ul de mai sus pt a vedea)
    // this.setState({background: event.target.value}, () => {console.log(this.state.background)});
  }

  // functia getMaxId calculeaza Id-ul maxim pentru un vector de useri
  getMaxId(users) {
    let maxId = 0;

    // parcurge fiecare user si verifica daca id-ul lui e mai mare decat cel mai mare id de pana atunci
    users.forEach(user => {
      if (user.id > maxId) {
        maxId = user.id;
      }
    });

    return maxId;
  }

  // ATENTIE! Metoda submitAddForm este apelata din componenta userAddForm. Respectivei componente trebuie sa ii
  // pasam functia ca props. Nu uitati ca la declansarea unui event, pe langa parametri primiti de functia asociata
  // eventului respectiv, primul parametru primit este chiar evenimentul!
  submitAddForm(event, name, email, isGoldClient) {
    // ATENTIE! Nu uitati de event.preventDefault, altfel la submiterea formularului se va reincarca pagina!
    event.preventDefault();
    // Trebuie sa adaugam un nou obiect in vectorul users din state. Deci trebuie sa actualizam partial campul
    // users din state => setState nu va mai primi ca parametru un obiect, ci o functie! (Check teorie)
    // Cand setState primeste ca parametru o functie, functia respectiva primeste ca parametru state-ul de dinaintea
    // aplicarii setState-ului curent.
    this.setState(prevState => {
      // Functia trebuie sa returneze un obiect care are ca cheie campul din state care va fi modificat.
      return {
        // ATENTIE! Facemn Array destructuring si apoi compunem un nou array care contine userii din state-ul anterior,
        // la care adaugam un nou user cu atributele venite din formular. Astfel, actualizam campul users din state.
        users: [
          ...prevState.users,
          {
            // Pentru id luam valoarea maxima din state-ul precedent si il incrementam cu 1.
            id: this.getMaxId(prevState.users) + 1,
            name,
            email,
            isGoldClient
          }
        ]
      }
    });
  }

  // ATENTIE! Metoda asta nu va merge! De ce? Din cauza ca atunci cand va fi apelata din userAddForm, THIS
  // nu va fi App! Din nou, topicul asta e mai complex, vizitati teoria!
  WRONG_submitAddForm(event, name, email, isGoldClient) {
    event.preventDefault();
    // AICI E BINE! Este doar o alta metoda de a spune functia care este trimisa ca parametru lui setState
    // va returna un obiect.
    this.setState(prevState => ({
      users: [
        ...prevState.users,
        {
          id: this.getMaxId(prevState.users) + 1,
          name,
          email,
          isGoldClient
        }
      ]
    }));
  }

  // Metoda aceasta va functiona, pentru ca i-am facut bind in constructor (vezi teorie).
  BINDED_submitAddForm(event, name, email, isGoldClient) {
    event.preventDefault();
    this.setState(prevState => ({
      users: [
        ...prevState.users,
        {
          id: this.getMaxId(prevState.users) + 1,
          name,
          email,
          isGoldClient
        }
      ]
    }));
  }

  // Cu toate ca va functiona si nu mai e nevoie de arrow function la pasarea metodei, NU ESTE RECOMANDAT
  // sa folositi sintaxa asta(class field methods), din rațiuni de performanță și testare. Din nou, go to teorie!
  NOT_RECOMMENDED_submitAddForm = (event, name, email, isGoldClient) => {
    event.preventDefault();
    // AICI E BINE! Este doar o alta metoda de a spune functia care este trimisa ca parametru lui setState
    // va returna un obiect.
    this.setState(prevState => ({
      users: [
        ...prevState.users,
        {
          id: this.getMaxId(prevState.users) + 1,
          name,
          email,
          isGoldClient
        }
      ]
    }));
  }

  render() {
    return(
      <div className="app" style={{background: this.state.background}}>
        <h1>Admin panel - Proiectul 1</h1>
        {/* De ce am inclus componenta UserAddForm in App.js? UserAddForm va modifica state-ul lui App! */}
        {/* Trebuie sa pasam DEFINITIA functiei submitAddForm ca prop catre UserAddForm. Ulterior, in UserAddForm,
        submitAddForm va fi executata. ATENTIE! Cand extragem in UserAddForm functia pasata ca props cu
        this.props.submitAddForm, numele din this.props trebuie sa fie acelasi cu numele atributului pasat aici. */}
        {/* De asemenea, nu uitați că la pasarea funcției trebuie să folosim arrow functions pentru ca this să
        refere în continuare la App.js!!! Iar dacă folosim arrow functions, trebuie să pasăm și parametri corespunzători! */}
        <UserAddForm submitAddForm={(event, name, email, isGoldClient) => this.submitAddForm(event, name, email, isGoldClient)}/>

        {/* Decomentati linia de mai jos si comentati UserAddForm-ul de mai sus pentru a testa functia
        WRONG_submitAddForm. */}
        {/* <UserAddForm submitAddForm={this.WRONG_submitAddForm}/> */}

        {/* Decomentati linia de mai jos si comentati UserAddForm-ul de mai sus pentru a testa functia
        BINDED_submitAddForm. */}
        {/* <UserAddForm submitAddForm={this.BINDED_submitAddForm}/> */}

        {/* Decomentati linia de mai jos si comentati UserAddForm-ul de mai sus pentru a testa functia
        NOT_RECOMMENDED_submitAddForm. */}
        {/* <UserAddForm submitAddForm={this.NOT_RECOMMENDED_submitAddForm}/> */}

        {/* Randam componenta UserList, careia ii trimitem ca proprietati userii din state. */}
        <UserList users={this.state.users}/>

        <input type="color" onChange={(event) => this.changeColor(event)}/>
      </div>
    );
  }
}

export default App;
