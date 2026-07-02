'use client'

import { useState } from 'react'
import type { Produto } from '@/types/produtos'
import type { ItemOrcamento } from '@/types/orcamentos'

type LinhaItem = {
  key: string
  produtoId: number | ''
  quantidade: string
  precoUnitario: string
}

function criarLinha(item?: ItemOrcamento): LinhaItem {
  return {
    key: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()),
    produtoId: item?.produtoId ?? '',
    quantidade: item ? String(item.quantidade) : '1',
    precoUnitario: item ? item.precoUnitarioRegistro.toFixed(2) : '',
  }
}

/**
 * Renderiza as linhas de itens de um orçamento (produto, quantidade, preço).
 * Deve ficar dentro de um <form action={...}> — os campos usam os nomes
 * `produtoId[]`, `quantidade[]` e `precoUnitario[]`, lidos com
 * `formData.getAll(...)` na server action (linhas alinhadas por posição).
 */
export default function ItensOrcamento({
  produtos,
  itensIniciais,
}: {
  produtos: Produto[]
  itensIniciais?: ItemOrcamento[]
}) {
  const [linhas, setLinhas] = useState<LinhaItem[]>(() =>
    itensIniciais && itensIniciais.length > 0
      ? itensIniciais.map((item) => criarLinha(item))
      : [criarLinha()],
  )

  function adicionarLinha() {
    setLinhas((atual) => [...atual, criarLinha()])
  }

  function removerLinha(key: string) {
    setLinhas((atual) => (atual.length > 1 ? atual.filter((l) => l.key !== key) : atual))
  }

  return (
    <div className="d-flex flex-column gap-3">
      {linhas.map((linha) => (
        <div key={linha.key} className="row g-2 align-items-end border rounded-4 p-3 mx-0">
          <div className="col-md-5">
            <label className="form-label">Produto</label>
            <select
              name="produtoId[]"
              className="form-select"
              defaultValue={linha.produtoId}
              required
            >
              <option value="" disabled>
                Selecione um produto
              </option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                  {!p.ativo ? ' (inativo)' : ''} — R$ {Number(p.precoUnitario).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Quantidade</label>
            <input
              name="quantidade[]"
              type="number"
              step="0.0001"
              min="0.0001"
              className="form-control"
              defaultValue={linha.quantidade}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Preço unitário</label>
            <input
              name="precoUnitario[]"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              defaultValue={linha.precoUnitario}
              placeholder="Preço atual do produto"
            />
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-danger w-100"
              onClick={() => removerLinha(linha.key)}
              disabled={linhas.length === 1}
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <div>
        <button type="button" className="btn btn-outline-primary" onClick={adicionarLinha}>
          + Adicionar item
        </button>
      </div>
    </div>
  )
}
