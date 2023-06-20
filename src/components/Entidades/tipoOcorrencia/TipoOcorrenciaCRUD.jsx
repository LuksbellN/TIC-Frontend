import React, { Component } from "react";
import axios from "../../../main/axiosConfig";
import Main from "../../template/Main";

const headerProps = {
  icon: 'exclamation-triangle',
  title: 'Tipos de Ocorrência',
  subtitle: 'Cadastro de tipos de ocorrência: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3333/api';

const initialState = {
  tipoOcorrencia: { nome: '' },
  list: [],
  token: ''
}

export default class TipoOcorrenciaCrud extends Component {
  state = { ...initialState };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: 'Bearer ' + token
    }
    axios(baseUrl + '/ocorrenciatipo', {
      headers
    }).then(resp => {
      this.setState({ list: resp.data.data })
    });
  }

  clear() {
    this.setState({ tipoOcorrencia: initialState.tipoOcorrencia });
  }

  async save() {
    const token = localStorage.getItem("token");
    const tipoOcorrencia = this.state.tipoOcorrencia;
    const method = tipoOcorrencia.id !== undefined ? 'patch' : 'post';
    const url = tipoOcorrencia.id !== undefined ? `${baseUrl}/ocorrenciatipo/${tipoOcorrencia.id}` : baseUrl + '/ocorrenciatipo';
    await axios[method](url, tipoOcorrencia, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(async resp => {
        let list;
        if (method === 'post') {
          list = this.getUpdatedList(resp.data.data, true);
        } else {
          list = this.getUpdatedList({ ...tipoOcorrencia, ...resp.data });
        }
        this.setState({ tipoOcorrencia: initialState.tipoOcorrencia, list });
      });
  }

  getUpdatedList(tipoOcorrencia, add = true) {
    const list = this.state.list.filter(t => t.id !== tipoOcorrencia.id);
    if (add) list.unshift(tipoOcorrencia);
    return list;
  }

  updateField(event) {
    const tipoOcorrencia = { ...this.state.tipoOcorrencia };
    tipoOcorrencia[event.target.name] = event.target.value;
    this.setState({ tipoOcorrencia });
  }

  load(tipoOcorrencia) {
    this.setState({ tipoOcorrencia });
  }

  async remove(tipoOcorrencia) {
    const token = localStorage.getItem("token");
    await axios.delete(`${baseUrl}/ocorrenciatipo/${tipoOcorrencia.id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(resp => {
      const list = this.getUpdatedList(tipoOcorrencia, false);
      this.setState({ list });
    });
  }

  renderForm() {
    const { tipoOcorrencia } = this.state;

    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="nome">Nome do Tipo de Ocorrência</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={tipoOcorrencia.nome}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome do tipo de ocorrência..."
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
            <th>Nome do Tipo de Ocorrência</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map(tipoOcorrencia => {
      return (
        <tr key={tipoOcorrencia.id}>
          <td>{tipoOcorrencia.id}</td>
          <td>{tipoOcorrencia.nome}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(tipoOcorrencia)}
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
