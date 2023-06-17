import React, { Component } from "react";
import axios from "../../../main/axiosConfig";
import Main from "../../template/Main";

const headerProps = {
  icon: 'building',
  title: 'Fornecedores',
  subtitle: 'Cadastro de fornecedores: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3333/api';

const initialState = {
  fornecedor: { nome_fornecedor: '', documento: '' },
  list: [],
  token: ''
}

export default class FornecedorCrud extends Component {
  state = { ...initialState };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: 'Bearer ' + token
    }
    axios(baseUrl + '/fornecedor', {
      headers
    }).then(resp => {
      this.setState({ list: resp.data.data })
    });
  }

  clear() {
    this.setState({ fornecedor: initialState.fornecedor });
  }

  async save() {
    const token = localStorage.getItem("token");
    const fornecedor = this.state.fornecedor;
    const method = fornecedor.id !== undefined ? 'patch' : 'post';
    const url = fornecedor.id !== undefined ? `${baseUrl}/fornecedor/${fornecedor.id}` : baseUrl + '/fornecedor';
    await axios[method](url, fornecedor, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(async resp => {
        let list;
        if (method === 'post') {
          list = this.getUpdatedList(resp.data.data, true);
        } else {
          list = this.getUpdatedList({ ...fornecedor, ...resp.data });
        }
        this.setState({ fornecedor: initialState.fornecedor, list });
      });
  }

  getUpdatedList(fornecedor, add = true) {
    const list = this.state.list.filter(f => f.id !== fornecedor.id);
    if (add) list.unshift(fornecedor);
    return list;
  }

  updateField(event) {
    const fornecedor = { ...this.state.fornecedor };
    fornecedor[event.target.name] = event.target.value;
    this.setState({ fornecedor });
  }

  load(fornecedor) {
    this.setState({ fornecedor });
  }

  async remove(fornecedor) {
    const token = localStorage.getItem("token");
    await axios.delete(`${baseUrl}/fornecedor/${fornecedor.id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(resp => {
      const list = this.getUpdatedList(fornecedor, false);
      this.setState({ list });
    });
  }

  renderForm() {
    const { fornecedor } = this.state;

    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="nome_fornecedor">Nome do Fornecedor</label>
              <input
                type="text"
                className="form-control"
                name="nome_fornecedor"
                value={fornecedor.nome_fornecedor}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome do fornecedor..."
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="documento">Documento</label>
              <input
                type="text"
                className="form-control"
                name="documento"
                value={fornecedor.documento}
                onChange={e => this.updateField(e)}
                placeholder="Digite o documento do fornecedor..."
              />
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={e => this.save(e)}
            >
              Salvar
            </button>

            <button
              className="btn btn-secondary" 
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
            <th>Nome do Fornecedor</th>
            <th>Documento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map(fornecedor => {
      return (
        <tr key={fornecedor.id}>
          <td>{fornecedor.id}</td>
          <td>{fornecedor.nome_fornecedor}</td>
          <td>{fornecedor.documento}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(fornecedor)}
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
