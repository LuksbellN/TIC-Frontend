import React, { Component } from 'react';
import axios from '../../../main/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Main from '../../template/Main';

const headerProps = {
    icon: 'home',
    title: 'Cadastrar Patrimônio',
    subtitle: 'Cadastro de Patrimônios',
};

const initialState = {
    patrimonio: {
        tipo: '',
        id_departamento: '',
        id_categoria: '',
        id_fornecedor: '',
        nome: '',
        dataAquisicao: new Date().toISOString().slice(0, 10),
        estado: '',
        valor: '',
        placa: '',
        nome_doador: '',
        telefone: '',
        imagem: null,
        imagem_url: '',
    },
    categorias: [],
    departamentos: [],
    fornecedores: [],
};

class PatrimonioCreate extends Component {
    state = { ...initialState };

    componentDidMount() {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer ' + token,
        };

        this.fetchCategorias(headers);
        this.fetchDepartamentos(headers);
        this.fetchFornecedores(headers);
    }

    fetchCategorias(headers) {
        axios
            .get('http://localhost:3333/api/categoria', { headers })
            .then((res) => {
                this.setState({ categorias: res.data.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchDepartamentos(headers) {
        axios
            .get('http://localhost:3333/api/departamento', { headers })
            .then((res) => {
                this.setState({ departamentos: res.data.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchFornecedores(headers) {
        axios
            .get('http://localhost:3333/api/fornecedor', { headers })
            .then((res) => {
                this.setState({ fornecedores: res.data.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateCategoria(event) {
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                id_categoria: event.target.value,
            },
        });
    }

    updateDepartamento(event) {
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                id_departamento: event.target.value,
            },
        });
    }

    updateFornecedor(event) {
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                id_fornecedor: event.target.value,
            },
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                [name]: value,
            },
        });
    };

    handleImageChange = (event) => {
        this.setState({ patrimonio: { ...this.state.patrimonio, imagem: event.target.files[0] } })
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { patrimonio } = this.state;

        try {
            const formData = new FormData();
            formData.append('imagem', patrimonio.imagem);

            const urlImg = await axios.post(
                'http://localhost:3333/api/upload',
                formData,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'multipart/form-data', // Definir o tipo de conteúdo como 'multipart/form-data'
                    },
                }
            );

            patrimonio.imagem_url = urlImg.data.data;

            const response = await axios.post(
                'http://localhost:3333/api/patrimonio',
                patrimonio,
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                }
            );

            console.log(response.data);

            // Redirecionar para a tela de listagem de patrimônios
            this.props.navigate('/patrimonios');
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const {
            patrimonio,
            categorias,
            fornecedores,
            departamentos,
        } = this.state;

        return (
            <Main {...headerProps}>
                <div className="card mx-auto" style={{ maxWidth: '600px'}}>
                    <div className="card-header">
                        <h4>Cadastrar Patrimônio</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Tipo:</label>
                                        <select
                                            className="form-control form-control-lg"
                                            name="tipo"
                                            value={patrimonio.tipo}
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="pref">Prefeitura</option>
                                            <option value="adq">Adquirido</option>
                                            <option value="doa">Doação</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Departamento:</label>
                                        <select
                                            className="form-control form-control-lg"
                                            name="id_departamento"
                                            value={patrimonio.id_departamento}
                                            onChange={(e) => this.updateDepartamento(e)}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {departamentos.map((departamento) => (
                                                <option key={departamento.id} value={departamento.id}>
                                                    {departamento.nome_departamento}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Categoria:</label>
                                        <select
                                            className="form-control form-control-lg"
                                            name="id_categoria"
                                            value={patrimonio.id_categoria}
                                            onChange={(e) => this.updateCategoria(e)}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.nome_categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Fornecedor:</label>
                                        <select
                                            className="form-control form-control-lg"
                                            name="id_fornecedor"
                                            value={patrimonio.id_fornecedor}
                                            onChange={(e) => this.updateFornecedor(e)}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {fornecedores.map((fornecedor) => (
                                                <option key={fornecedor.id} value={fornecedor.id}>
                                                    {fornecedor.nome_fornecedor}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group ">
                                        <label>Nome:</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="nome"
                                            value={patrimonio.nome}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Data de Aquisição:</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg"
                                            name="dataAquisicao"
                                            value={patrimonio.dataAquisicao}
                                            onChange={this.handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Estado:</label>
                                        <select
                                            className="form-control form-control-lg"
                                            name="estado"
                                            value={patrimonio.estado || '3'}
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option value="1">1 - Péssimo</option>
                                            <option value="2">2 - Ruim</option>
                                            <option value="3">3 - Regular</option>
                                            <option value="4">4 - Bom</option>
                                            <option value="5">5 - Ótimo</option>
                                        </select>
                                    </div>


                                    {/* Condição para renderizar os campos adicionais baseados no tipo selecionado */}
                                    {patrimonio.tipo === 'adq' && (
                                        <div className="form-group">
                                            <label>Valor:</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-lg"
                                                name="valor"
                                                value={patrimonio.valor}
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </div>
                                    )}

                                    {patrimonio.tipo === 'pref' && (
                                        <div>
                                            <div className="form-group">
                                                <label>Valor:</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg"
                                                    name="valor"
                                                    value={patrimonio.valor}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Placa:</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    name="placa"
                                                    value={patrimonio.placa}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {patrimonio.tipo === 'doa' && (
                                        <div>
                                            <div className="form-group">
                                                <label>Nome do Doador:</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    name="nome_doador"
                                                    value={patrimonio.nome_doador}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Telefone:</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg"
                                                    name="telefone"
                                                    value={patrimonio.telefone}
                                                    onChange={this.handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Imagem:</label>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            name="imagem"
                                            onChange={this.handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group d-flex justify-content-end">
                                <button type="submit" className="btn btn-success btn-lg">
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => this.props.navigate('/patrimonios')}
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </Main>
        );
    }
}

export default function PatrimonioCreateWrapper(props) {
    const navigate = useNavigate();

    return <PatrimonioCreate {...props} navigate={navigate} />;
}

