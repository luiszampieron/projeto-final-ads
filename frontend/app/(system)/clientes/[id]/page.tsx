import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiRequestError, apiServerJson } from "@/lib/api-server";
import type { Cliente } from "@/types/clientes";
import { atualizarCliente, removerCliente } from "../actions";

function getMensagem(
  params: Record<string, string | string[] | undefined>,
  chave: "sucesso" | "erro",
) {
  const valor = params[chave];
  return typeof valor === "string" ? valor : undefined;
}

export default async function ClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const paramsSearch = searchParams ? await searchParams : {};
  const sucesso = getMensagem(paramsSearch, "sucesso");
  const erro = getMensagem(paramsSearch, "erro");
  let cliente: Cliente;

  try {
    cliente = await apiServerJson<Cliente>(`/clientes/${id}`);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <section className="row g-4">
      <div className="col-12">
        <span className="section-eyebrow">Clientes</span>
        <h1 className="display-6 fw-bold mb-2">Editar cliente</h1>
        <p className="text-muted mb-0">
          Atualize os dados do cliente e salve as alterações.
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
                <h2 className="h5 mb-1">Cliente #{cliente.id}</h2>
                <p className="text-muted mb-0">{cliente.nome}</p>
              </div>
              <Link href="/clientes" className="btn btn-outline-secondary">
                Voltar para lista
              </Link>
            </div>

            <form action={atualizarCliente} className="row g-3 mb-4">
              <input type="hidden" name="id" value={cliente.id} />

              <div className="col-12">
                <label htmlFor="nome" className="form-label">
                  Nome
                </label>
                <input
                  id="nome"
                  name="nome"
                  className="form-control"
                  maxLength={200}
                  defaultValue={cliente.nome}
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
                  defaultValue={cliente.documento ?? ""}
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
                  defaultValue={cliente.email ?? ""}
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
                  defaultValue={cliente.telefone ?? ""}
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
                  defaultValue={cliente.observacoes ?? ""}
                />
              </div>

              <div className="col-12 d-flex flex-wrap gap-2">
                <button type="submit" className="btn btn-primary">
                  Salvar alterações
                </button>
              </div>
            </form>

            <div className="border-top pt-4">
              <form action={removerCliente}>
                <input type="hidden" name="id" value={cliente.id} />
                <button type="submit" className="btn btn-outline-danger">
                  Excluir cliente
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}