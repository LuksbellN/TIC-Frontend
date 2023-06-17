import React, { Component } from "react";
import axios from "../../../main/axiosConfig";
import Main from "../../template/Main";

const headerProps = {
  icon: 'users',
  title: 'Usuários',
  subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3333/api';

const initialState = {
  user: { userName: '', email: '', senha: '', id_departamento: '' },
  departamentos: [],
  list: [],
  token: ''
}


export default class UserCrud extends Component {
  state = { ...initialState };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: 'Bearer ' + token
    }
    axios(baseUrl + '/usuario', {
      headers
    }).then(resp => {
      this.setState({ list: resp.data.data })
    })

    axios.get(baseUrl + '/departamento', {
      headers
    })
      .then(resp => {
        this.setState({ departamentos: resp.data.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  clear() {
    this.setState({ user: initialState.user })
  }

  async save() {
    const token = localStorage.getItem("token");
    const user = this.state.user;
    const method = user.id !== undefined ? 'patch' : 'post';
    const url = user.id !== undefined ? `${baseUrl}/usuario/${user.id}` : baseUrl + '/usuario';
    await axios[method](url, user, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(async resp => {
        let list;
        if(method === 'post') {
          list =  this.getUpdatedList(resp.data.data, true);
        } else {
          list = this.getUpdatedList({...user, ...resp.data})
        }
        this.setState({ user: initialState.user, list });
      });
  }
  

  getUpdatedList(user, add = true) {
    const list = this.state.list.filter(u => u.id !== user.id);
    if (add) list.unshift(user);
    return list
  }

  updateField(event) {
    const user = { ...this.state.user };
    user[event.target.name] = event.target.value;
    this.setState({ user });
  }

  load(user) {
    // Bloquear o campo de senha ao carregar o usuário
    const userWithBlockedPassword = { ...user, senha: '' };
    this.setState({ user: userWithBlockedPassword });
  }

  async remove(user) {
    const token = localStorage.getItem("token");
    await axios.delete(`${baseUrl}/usuario/${user.id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }}).then(resp => {
      const list = this.getUpdatedList(user, false);
      this.setState({ list })
    })
  }

  renderForm() {
    const { departamentos, user } = this.state;

    // Verifica se a lista de departamentos está carregada
    if (!departamentos) {
      return <div>Carregando...</div>;
    }

    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                className="form-control"
                name="userName"
                value={user.userName}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome..."
              />
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={user.email}
                onChange={e => this.updateField(e)}
                placeholder="Digite o email..."
              />
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                type="text"
                className="form-control"
                name="senha"
                value={user.senha}
                onChange={e => this.updateField(e)}
                placeholder="Digite a senha..."
                disabled={user.id !== undefined} // Desabilita o campo se o usuário já existir
              />
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="form-group">
              <label htmlFor="id_departamento">Departamento</label>
              <select
                className="form-control"
                name="id_departamento"
                value={user.id_departamento}
                onChange={e => this.updateField(e)}
              >
                <option value="">Selecione o departamento</option>
                {departamentos.map(departamento => (
                  <option
                    key={departamento.id}
                    value={departamento.id}
                  >
                    {departamento.nome_departamento}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={async e => await this.save(e)}>
              Salvar
            </button>

            <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)} style={{ marginLeft: '8px' }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Departamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    )
  }

  renderRows() {
    if (this.state.list == null) return null
    return this.state.list.map(user => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.userName}</td>
          <td>{user.email}</td>
          <td>{this.state.departamentos.filter(d => d.id === user.id_departamento)[0]?.nome_departamento}</td>
          <td>
            <button className="btn btn-warning" onClick={e => this.load(user)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button className="btn btn-danger" onClick={e => this.remove(user)} >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    )
  }
}
