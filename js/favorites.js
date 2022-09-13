// Essa classe contem a lógica dos dados
// Ela vai dizer como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  tableClear() {
    if (this.entries.length === 0) {
      this.addClassTable()
    } else {
      this.removeClass()
    }
  }

  addClassTable() {
    this.table.classList.add('tableNude')
    this.starTable.style.display = 'flex'
  }

  removeClass() {
    this.table.classList.remove('tableNude')

    this.starTable.style.display = 'none'
  }

  delete(user) {
    // Higher-order functions (map, filter, finder, reduce)
    this.entries = this.entries.filter(
      entry => entry.login !== user.login
      // se o filter retorar falso ele elimina do array se retorar true ele coloca no array
      // Aqui eu estou colocando um novo array dentro do this.entries, não estou modificando ele, estou criando um novo e colocando dentro dele sem o favorites que eu deletei
    )
    this.update()
    this.save()
  }
}

// Essa classe vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    this.table = this.root.querySelector('.table')
    this.starTable = this.root.querySelector('.nuleFavorite')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('header button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('#input-search')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()
    this.tableClear()
    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      // evento de click para remover o favoritos
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover?')

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img
        src="https://github.com/GabrielRodrigues-pd.png"
        alt="Imagem de Gabriel Rodrigues"
      />
      <a href="#">
        <p>Gabriel Rodrigues</p>
        <span>gabrielrodrigues-pd</span>
      </a>
    </td>
    <td class="repositories">44</td>
    <td class="followers">4444</td>
    <td>
      <button class="remove">Remover</button>
    </td>`

    return tr
  }
}

// Essa classe vai buscar os dados do github
export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}
