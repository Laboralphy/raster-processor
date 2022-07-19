class ArrayHelper {
  /**
   * Turns an array-like-structure into an array (a real one)
   */
  static array (subject) {
    const LENGTH_PROPERTY = 'length'
    if (Array.isArray(subject)) {
      return subject
    }
    if (typeof subject === 'object') {
      // is there a length property ?
      const bLength = LENGTH_PROPERTY in subject
      // extracting keys minus "length" property
      const aKeys = Object
        .keys(subject)
        .filter(k => k !== LENGTH_PROPERTY)
      if (aKeys.some(k => isNaN(k))) {
        return false
      }
      if ((bLength) && (subject[LENGTH_PROPERTY] !== aKeys.length)) {
        return false
      }
      if (aKeys
        .map(k => parseInt(k))
        .sort((k1, k2) => k1 - k2)
        .every((k, i) => k === i)) {
        return bLength
          ? Array.prototype.slice.call(subject, 0)
          : aKeys.map(k => subject[k])
      }
    }
    return false
  }

  /**
   * process an input array. Dispatch all items into category-arrays, each category-array is then sorted according to another function
   * @param aInput {array}
   * @param cat {function} will be call for each aInput item, this function is expected to return a category identifier
   * @param sort {function} will be used to sort all categories
   */
  static categorize (aInput, { cat, sort = null }) {
    const oOutput = {}
    aInput.forEach(e => {
      const sCat = cat(e)
      if (!(sCat in oOutput)) {
        oOutput[sCat] = []
      }
      oOutput[sCat].push(e)
    })
    if (typeof sort === 'function') {
      for (const sCat in oOutput) {
        oOutput[sCat] = oOutput[sCat].sort(sort)
      }
    }
    return oOutput
  }

  /**
   * Remove all duplicate entries in the specified array. This will not modify the array ; a new one
   * @param aArray
   * @returns {*}
   */
  static uniq (aArray) {
    return aArray.filter((x, i, a) => a.indexOf(x) === i)
  }

  /**
   * quickly clones an array into a new one
   * this method is mainly used for turning "arguments" pseudo array into a real array
   * @param a {Array|Object}
   * @return {Array}
   */
  static clone (a) {
    return Array.prototype.slice.call(a, 0)
  }

  /**
   * returns two arrays
   * array 'old' contains all items that are in A but not in B
   * array 'new' contains all items that are in B but not in A
   *
   * @param a
   * @param b
   * @returns {{new: ...*[], old: ...*[]}}
   */
  static diff (a, b) {
    const a1 = new Set(a)
    const b1 = new Set(b)
    // in a & not in b
    const notInB = [...new Set([...a].filter(x => !b1.has(x)))]
    const notInA = [...new Set([...b].filter(x => !a1.has(x)))]
    return {
      new: notInA,
      old: notInB
    }
  }

  /**
   * supprime un élément du tableau spécifié
   * @param aArray {[]} tableau auquel on supprime un élément
   * @param element {*} élément à retirer
   */
  static remove (aArray, element) {
    const i = aArray.indexOf(element)
    if (i >= 0) {
      aArray.splice(i, 1)
    }
  }

  /**
   * Methode mutable : Remplace le contenu d'un tableau observé, en conservant les observateurs
   * @param aArray {[]}
   * @param d {[]}
   * @returns {[]}
   */
  static update (aArray, d) {
    if (Array.isArray(d)) {
      aArray.splice(0, aArray.length, ...d)
    } else {
      throw new Error('ArrayHelper.update : second parameter must be of type Array.')
    }
    return aArray
  }

  /**
   * Modifie un élément du tableau, en garantissant me respect de la réactivité
   * @param aArray {[]}
   * @param index {number}
   * @param value {*}
   */
  static setElement (aArray, index, value) {
    aArray.splice(index, 1, value)
  }

  /**
   * Remplace un élément dans un tableau. Utile pour des élément de type objet
   * @param aArray {[]}
   * @param element {*}
   */
  static updateElement (aArray, element) {
    const index = aArray.indexOf(element)
    if (index >= 0) {
      ArrayHelper.setElement(aArray, index, element)
    }
  }

  /**
   * Vide un tableau de tous ses éléments
   * @param aArray {[]}
   */
  static truncate (aArray) {
    aArray.splice(0, aArray.length)
  }

  /**
   * Déplace un élément du tableau sur le nouvelle index
   * @param aArray {[]}
   * @param element {*}
   * @param newIndex {number}
   * @return {[]}
   */
  static moveElement (aArray, element, newIndex) {
    const index = aArray.indexOf(element)
    if (index < 0) {
      return aArray
    }
    aArray.splice(index, 1)
    aArray.splice(newIndex, 0, element)
    return aArray
  }

  /**
   * création d'un tableau de longueur spécifié avec appel d'un callback pour chaque nouvel élément
   * @param nLength {number}
   * @param cb {function} fonction appelée pour cghaque élément nouvellement créé, la fonction doit renvoyer la vbaleur
   * qui sera insérée dans le tableau
   */
  static create (nLength, cb) {
    const a = []
    a.length = nLength
    for (let i = 0; i < nLength; ++i) {
      a[i] = cb(i, a)
    }
    return a
  }
}

module.exports = ArrayHelper
