import React, { Component } from "react";
import axios from "../../../main/axiosConfig";
import Main from "../../template/Main";

const headerProps = {
  icon: 'university',
  title: 'Departamentos',
  subtitle: 'Cadastro de departamentos: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3333/api';

const initialState = {
  departamento: { nome_departamento: '' },
  list: [],
  token: ''
}

export default class DepartamentoCrud extends Component {
  state = { ...initialState };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: 'Bearer ' + token
    }
    axios(baseUrl + '/departamento', {
      headers
    }).then(resp => {
      this.setState({ list: resp.data.data })
    });
  }

  clear() {
    this.setState({ departamento: initialState.departamento });
  }

  async save() {
    const token = localStorage.getItem("token");
    const departamento = this.state.departamento;
    const method = departamento.id !== undefined ? 'patch' : 'post';
    const url = departamento.id !== undefined ? `${baseUrl}/departamento/${departamento.id}` : baseUrl + '/departamento';
    await axios[method](url, departamento, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(async resp => {
        let list;
        if (method === 'post') {
          list = this.getUpdatedList(resp.data.data, true);
        } else {
          list = this.getUpdatedList({ ...departamento, ...resp.data });
        }
        this.setState({ departamento: initialState.departamento, list });
      });
  }

  getUpdatedList(departamento, add = true) {
    const list = this.state.list.filter(d => d.id !== departamento.id);
    if (add) list.unshift(departamento);
    return list;
  }

  updateField(event) {
    const departamento = { ...this.state.departamento };
    departamento[event.target.name] = event.target.value;
    this.setState({ departamento });
  }

  load(departamento) {
    this.setState({ departamento });
  }

  async remove(departamento) {
    const token = localStorage.getItem("token");
    await axios.delete(`${baseUrl}/departamento/${departamento.id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(resp => {
      const list = this.getUpdatedList(departamento, false);
      this.setState({ list });
    });
  }

  renderForm() {
    const { departamento } = this.state;

    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="nome_departamento">Nome do Departamento</label>
              <input
                type="text"
                className="form-control"
                name="nome_departamento"
                value={departamento.nome_departamento}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome do departamento..."
              />
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button
              className="btn btn-primary btn-lg"
              onClick={e => this.save(e)}
            >
              Salvar
            </button>

            <button
              className="btn btn-secondary btn-lg"
              style={{ marginLeft: '8px' }}
              onClick={e => this.clear(e)}
            >
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
            <th>Nome do Departamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map(departamento => {
      return (
        <tr key={departamento.id}>
          <td>{departamento.id}</td>
          <td>{departamento.nome_departamento}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(departamento)}
            >
              <i className="fa fa-pencil"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
