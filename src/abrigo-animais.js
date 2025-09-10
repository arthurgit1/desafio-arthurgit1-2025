class AbrigoAnimais {
  constructor() {
    this.ANIMAIS = {
      Rex:   { tipo: 'cão',    brinquedos: ['RATO', 'BOLA'] },
      Mimi:  { tipo: 'gato',   brinquedos: ['BOLA', 'LASER'] },
      Fofo:  { tipo: 'gato',   brinquedos: ['BOLA', 'RATO', 'LASER'] },
      Zero:  { tipo: 'gato',   brinquedos: ['RATO', 'BOLA'] },
      Bola:  { tipo: 'cão',    brinquedos: ['CAIXA', 'NOVELO'] },
      Bebe:  { tipo: 'cão',    brinquedos: ['LASER', 'RATO', 'BOLA'] },
      Loco:  { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    };

    this.BRINQUEDOS_VALIDOS = [
      'RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'
    ];
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const listaBrinquedos1 = brinquedosPessoa1.split(',').map(b => b.trim().toUpperCase()).filter(b => b);
    const listaBrinquedos2 = brinquedosPessoa2.split(',').map(b => b.trim().toUpperCase()).filter(b => b);
    const listaAnimais = ordemAnimais.split(',').map(a => a.trim());

    // Validação de animais duplicados ou inválidos
    const animaisUnicos = new Set(listaAnimais);
    const animaisValidos = Object.keys(this.ANIMAIS);
    if (animaisUnicos.size !== listaAnimais.length ||
        !listaAnimais.every(a => animaisValidos.includes(a))) {
      return { erro: 'Animal inválido' };
    }

    // Validação de brinquedos duplicados ou inválidos
    const brinquedosTodos = [...listaBrinquedos1, ...listaBrinquedos2];
    const brinquedosUnicos = new Set(brinquedosTodos);
    if (
      brinquedosTodos.length > 0 && (
        brinquedosUnicos.size !== brinquedosTodos.length ||
        !brinquedosTodos.every(b => this.BRINQUEDOS_VALIDOS.includes(b))
      )
    ) {
      return { erro: 'Brinquedo inválido' };
    }

    let adotadosPessoa1 = 0;
    let adotadosPessoa2 = 0;
    let resultado = [];
    let companhiaParaLoco = false;

    function contemOrdem(favoritos, lista) {
      let i = 0;
      for (let b of lista) {
        if (b === favoritos[i]) i++;
        if (i === favoritos.length) return true;
      }
      return i === favoritos.length;
    }

    function contemTodos(favoritos, lista) {
      return favoritos.every(fav => lista.includes(fav));
    }

    function contemOrdemGato(favoritos, lista) {
      if (favoritos.length !== lista.length) return false;
      for (let i = 0; i < favoritos.length; i++) {
        if (favoritos[i] !== lista[i]) return false;
      }
      return true;
    }

    for (let animalNome of listaAnimais) {
      if (!this.ANIMAIS[animalNome]) {
        resultado.push(`${animalNome} - abrigo`);
        continue;
      }
      const animal = this.ANIMAIS[animalNome];
      let pode1 = false, pode2 = false;
      let destino = 'abrigo';

      if (animalNome === 'Loco') {
        if (companhiaParaLoco) {
          pode1 = contemTodos(animal.brinquedos, listaBrinquedos1);
          pode2 = contemTodos(animal.brinquedos, listaBrinquedos2);
        }
        if (pode1 && pode2) {
          destino = 'abrigo';
        } else if (pode1 && adotadosPessoa1 < 3) {
          destino = 'pessoa 1';
          adotadosPessoa1++;
        } else if (pode2 && adotadosPessoa2 < 3) {
          destino = 'pessoa 2';
          adotadosPessoa2++;
        }
      } else if (animal.tipo === 'gato') {
        pode1 = contemOrdemGato(animal.brinquedos, listaBrinquedos1);
        pode2 = contemOrdemGato(animal.brinquedos, listaBrinquedos2);
        if (pode1 && pode2) {
          destino = 'abrigo';
        } else if (pode1 && adotadosPessoa1 < 3) {
          destino = 'pessoa 1';
          adotadosPessoa1++;
          companhiaParaLoco = true;
        } else if (pode2 && adotadosPessoa2 < 3) {
          destino = 'pessoa 2';
          adotadosPessoa2++;
          companhiaParaLoco = true;
        }
      } else {
        pode1 = contemOrdem(animal.brinquedos, listaBrinquedos1);
        pode2 = contemOrdem(animal.brinquedos, listaBrinquedos2);
        if (pode1 && pode2) {
          destino = 'abrigo';
        } else if (pode1 && adotadosPessoa1 < 3) {
          destino = 'pessoa 1';
          adotadosPessoa1++;
          companhiaParaLoco = true;
        } else if (pode2 && adotadosPessoa2 < 3) {
          destino = 'pessoa 2';
          adotadosPessoa2++;
          companhiaParaLoco = true;
        }
      }
      resultado.push(`${animalNome} - ${destino}`);
    }

    return {
      lista: resultado
    };
  }
}
export { AbrigoAnimais as AbrigoAnimais };
