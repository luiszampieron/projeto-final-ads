import Link from "next/link";
import { criarCliente } from "../actions";

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: "sucesso" | "erro",
) {
  const valor = params[chave];
  return typeof valor === "string" ? valor : undefined;
}

export default async function NovoClientePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const paramsSearch = searchParams ? await searchParams : {};
  const sucesso = getMensagem(paramsSearch, "sucesso");
  const erro = getMensagem(paramsSearch, "erro");

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Clientes</span>
        <h1 className="display-6 fw-bold mb-2">Cadastrar cliente</h1>
        <p className="text-muted mb-0">
          Preencha os dados do cliente e salve para cadastrá-lo.
        </p>
      </div>

      {sucesso && (
        <div className="col-12">
          <div className="alert alert-success mb-0">{sucesso}</div>
        </div>
      )}

      {erro && (
        <div className="col-12">
          <div className="alert alert-danger mb-0">{erro}</div>
        </div>
      )}

      <div className="col-12">
        <div className="card surface-card">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h2 className="h5 mb-1">Novo cliente</h2>
                <p className="text-muted mb-0">Informe os dados do cliente.</p>
              </div>
              <Link href="/clientes" className="btn btn-outline-secondary">
                Voltar para lista
              </Link>
            </div>

            <form action={criarCliente} className="row g-3">
              <div className="col-12">
                <label htmlFor="nome" className="form-label">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  className="form-control"
                  maxLength={200}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="documento" className="form-label">
                  Documento
                </label>
                <input
                  id="documento"
                  name="documento"
                  className="form-control"
                  maxLength={20}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="telefone" className="form-label">
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  className="form-control"
                  maxLength={30}
                />
              </div>

              <div className="col-12">
                <label htmlFor="observacoes" className="form-label">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  className="form-control"
                  rows={3}
                />
              </div>

              <div className="col-12 d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-primary">
                  Salvar cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
