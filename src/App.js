import React from 'react';
import './App.css';

import {Button, Modal, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'

//import Button from 'react-bootstrap/lib/button'
//import Modal from 'react-bootstrap/lib/Modal'
//import FieldGroup from 'react-bootstrap/lib/FieldGroup'
//import FormGroup from 'react-bootstrap/lib/FormCGroup'
//import FormControl from 'react-bootstrap/lib/FormControl'
//import ControlLabel from 'react-bootstrap/lib/ControlLabel'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recetas: [],
      modalActivo: false,
      editarActivo: false,
      editarID: 0,
      nombreActual: '',
      ingredientesActuales: ''
    };

    var recetasIniciales = [
        {nombre: 'Ojos de oveja', ingredientes: ['Ojos de oveja', 'Jugo de tomate', 'Vinagre'], expandido: false},
        {nombre: 'Queso con larvas', ingredientes: ['Queso', 'Larvas'], expandido: false},
        {nombre: 'Helado esquimal', ingredientes: ['Nieve', 'Grasa de venado', 'Aceite de foca', 'Pescado molido'], expandido: false}
    ];
    
    if(localStorage.recetasGuardadas) {
      this.state.recetas = JSON.parse(localStorage.getItem('recetasGuardadas'));
    }
    else {
      this.state.recetas = recetasIniciales;
    }

    this.expandir = this.expandir.bind(this);
    this.borrar = this.borrar.bind(this);
    this.abrir = this.abrir.bind(this);
    this.cerrar = this.cerrar.bind(this);
    this.monitorearFormulario = this.monitorearFormulario.bind(this);
    this.guardar = this.guardar.bind(this);
    this.editar = this.editar.bind(this);
  }

  expandir(id){
    let aux = this.state.recetas.slice();
    aux[id].expandido = !this.state.recetas[id].expandido;
    
    this.setState({
      recetas: aux
    });
  }

  borrar(id){
    let aux = this.state.recetas.slice();
    aux.splice(id, 1);

    this.setState({
      recetas: aux
    });
  }
  
  /* MODAL */
  abrir(){
    if(!this.state.modalActivo){
      this.setState({modalActivo: true});
    }
  }
  
  cerrar(){
    if(this.state.modalActivo){
      this.setState({
        modalActivo: false,
        editarActivo: false,
        nombreActual: '',
        ingredientesActuales: ''        
      });
    }
  }
  
  monitorearFormulario(n, i){
    this.setState({ nombreActual : n, ingredientesActuales: i});
  }
  
  guardar(){
    if(this.state.nombreActual && this.state.ingredientesActuales){
      let aux = this.state.recetas.slice();
      
      if(this.state.editarActivo){
        aux[this.state.editarID] = {"nombre": this.state.nombreActual, "ingredientes": this.state.ingredientesActuales, "expandido": false};
      }
      else{
        aux.push({nombre: this.state.nombreActual, ingredientes: this.state.ingredientesActuales, expandido: false});
      }
      
      this.setState({recetas: aux, 
                     modalActivo: false, 
                     editarActivo: false,
                     nombreActual: '', 
                     ingredientesActuales: ''});
//      this.cerrar;
    }
  }
  
  editar(id){
    this.setState({
      editarActivo: true,
      editarID: id,
      modalActivo: true,
      nombreActual: this.state.recetas[id].nombre,
      ingredientesActuales: this.state.recetas[id].ingredientes.join(',')
    });
  }
  
  componentDidMount() {
    console.log('hello world! ');
    console.log(localStorage.recetasGuardadas);
    localStorage.setItem("recetasGuardadas", JSON.stringify(this.state.recetas));
  }
  
  render() {
    return (
      <div className="container">
        <h1>Recetas Bizarras</h1>
        <br />
        <h2><button 
              type="button" 
              className="btn btn-success"
              onClick={this.abrir}
              >+ NUEVA </button></h2>

        {this.state.recetas.map((receta, id) => (
          <div className="subcontainer">
            <h3>
              <a onClick={this.expandir.bind(this, id)}>{receta.nombre}</a>
            </h3>
            <h4 className={receta.expandido ? "expand": "noExpand"}>
              <ul>
                {receta.ingredientes.map( (item) =>(
                  <li>{item}</li>))}
              </ul>
              <button 
                className="btn btn-info"
                onClick={this.editar.bind(this, id)}
                >Editar</button>
              <button 
                className="btn btn-danger"
                onClick={this.borrar.bind(this, id)}
                >Borrar</button>
            </h4>
          </div>
        ))}
        
        <Modal show={this.state.modalActivo} onHide={this.cerrar}>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Nombre:</ControlLabel>
              <FormControl
                type="text"
                value={this.state.nombreActual}
                placeholder={this.state.editarActivo ? this.state.nombreActual : "Nueva Receta"}
                onChange={ (event) => (
                  this.monitorearFormulario(event.target.value, this.state.ingredientesActuales))}
                ></FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Ingredientes (separados por comas):</ControlLabel>
              <FormControl
                type="text"
                value={this.state.ingredientesActuales}
                placeholder={this.state.editarActivo ? this.state.ingredientesActuales : "Ingrediente 1, Ingrediente 2, Ingrediente 3"}
                onChange={ (event) => (
                  this.monitorearFormulario(this.state.nombreActual, event.target.value.split(',')))}
                ></FormControl>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              className="btn btn-success"
              onClick={this.guardar}
              >Guardar</Button>
            <Button 
              className="btn btn-danger" 
              onClick={this.cerrar}
              >Cancelar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;