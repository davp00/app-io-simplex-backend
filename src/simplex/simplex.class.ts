const readline = require('readline');

export interface SimplexRestriction {
  x_n: number[];
  symbol: string;
  equal: number;
}

export interface SimplexVar {
  name: string;
  values: number[];
}

export interface SimplexReducer {
    value: number;
    multiply?: number;
}

export interface SimplexInOut {
    in: number;
    out: number;
}

let cl = readline.createInterface( process.stdin, process.stdout );
let question = function(q) {
  return new Promise( (res, rej) => {
    cl.question( q, answer => {
      res(answer);
    })
  });
};


export default class SimplexMethod {
  cj: number[];
  zj: number[];
  vs: string[];
  cj_zj: number[];
  cb: number[];

  matrix: SimplexVar[];

  restrictions: SimplexRestriction[];

  constructor(cj: number[], restrictions: SimplexRestriction[], private FO: string) {
    let array_default       = Array(restrictions.length).fill(0);
    let array_default_vars  = Array(cj.length).fill(0);

    this.cj = [...cj, ...array_default];
    this.restrictions = restrictions;
    this.cb = array_default;

    this.zj     = array_default.concat(array_default_vars, [0]);
    this.cj_zj  = Array(this.cj.length).fill(0);
  }

  public getMethod()
  {
      for (let r of this.restrictions)
      {
          if(r.symbol === '>=')
          {
              if(this.FO === 'max')
                return 3;
              else
                return 4;
          }
      }
      if( this.FO === 'max')
        return 1;
      else
        return 2;
  }

  public result()
  {
      const method_type = this.getMethod();
      switch (method_type) {
        case 1:
          this.Maximise();
          break;
        case 2:
          this.Minimise();
          break;
      }
  }

  public Maximise()
  {
      let result:any[] = [];
      this.matrix = this.getMatrix();
      this.init_solution_vars();

      do{
        this.calculate();

        let v = this.calculate_in_out_max();
        result.push({matrix: this.clone(this.matrix), zj: [...this.zj], cj_zj: [...this.cj_zj], vs: [...this.vs], cb: [...this.cb], in_out: v});

        this.doOne(v);

        let reducers = this.calculate_reducers(v.in, v.out);

        this.doZero(reducers, v);

        this.cb[v.out] = this.cj[v.in - 1];
      }while (! this.is_sol_max());

      result.forEach((element) =>
      {
          console.table(element.matrix);
          console.log("IN - OUT: ", element.in_out);
          console.log("V Solucion: ", element.vs);
          console.log("ZJ: ", element.zj);
          console.log("CJ-ZJ: ", element.cj_zj);
          console.log("                          \n");
      });
  }

  public Minimise()
  {
      let result:any[] = [];
      this.matrix = this.getMatrix();
      this.init_solution_vars();

      do {
        this.calculate();

        let v = this.calculate_in_out_min();
        result.push({matrix: this.clone(this.matrix), zj: [...this.zj], cj_zj: [...this.cj_zj], vs: [...this.vs], cb: [...this.cb], in_out: v});

        this.doOne(v);

        let reducers = this.calculate_reducers(v.in, v.out);

        this.doZero(reducers, v);

        this.cb[v.out] = this.cj[v.in - 1];
        this.vs[v.out] = this.matrix[v.in].name;
      }while (!this.is_sol_min());

      result.forEach((element) =>
      {
        console.table(element.matrix);
        console.log("IN - OUT: ", element.in_out);
        console.log("V Solucion: ", element.vs);
        console.log("ZJ: ", element.zj);
        console.log("CJ-ZJ: ", element.cj_zj);
        console.log("                          \n");
      });

      const solution = this.getSolution();
      for (let va in solution)
      {
          console.log(va, ':', solution[va]);
      }
  }

  private getSolution()
  {
      let solution = {z: this.zj[0], xn: Array(this.cj.length - this.restrictions.length).fill(0)};

      this.vs.forEach((element, i) =>
      {
          if(element[0] !== 'x')
            return;
          let pos = Number(element[1]) - 1;

          solution.xn[pos] = this.matrix[0].values[i];
      });

      return solution;
  }

  private doZero(reducers: SimplexReducer[], v: SimplexInOut)
  {
      this.matrix.forEach((element, y) =>
      {
          element.values.forEach((value, x) =>
          {
            if(x === v.out) return;
            let r = reducers[x];
            this.matrix[y].values[x] = this.matrix[y].values[x] + (r.value*this.matrix[y].values[v.out])
          });
      });
  }

  private doOne(v: SimplexInOut)
  {
      let divide = this.matrix[ v.in ].values[ v.out ];

      this.matrix.forEach((element, i ) =>
      {
        element.values[ v.out ] = element.values[ v.out ] / divide;
      });
  }

  private getMatrix(): SimplexVar[]
  {
      let matrix: SimplexVar[] = [];
      let equals = this.restrictions.map((e) => e.equal);

      matrix.push({name: 'Sol', values: equals});

      for (let i = 0 ; i < this.cj.length - this.restrictions.length; i++ )
      {
          matrix.push({name: `x${i+1}`, values: []});
      }

      for (let i in this.restrictions)
      {
          let r = this.restrictions[i];

          r.x_n.forEach((element, n) =>
          {
              matrix[n+1].values.push(element);
          });

          let values = Array(this.restrictions.length).fill(0);

          values[i] = 1;

          matrix.push({name: `s${Number(i) + 1}`, values})
      }

      return matrix;
  }

  // Calcula zj y cj-zj
  private calculate()
  {
      this.matrix.forEach(( element, i ) =>
      {
          this.zj[i] = this.sum_array(element.values, this.cb);
      });

      this.cj.forEach((element, i) =>
      {
          this.cj_zj[i] = element - this.zj[i+1];
      });
  }


  private calculate_in_out_max(): SimplexInOut
  {
      let max:number = 0,min:number = undefined, v_in:number = 0, v_out: number = 0;

      this.cj_zj.forEach((element, i) =>
      {
          if (element > max)
          {
             max  = element;
             v_in = i + 1;
          }
      });

      this.matrix[0].values.forEach((b, i) =>
      {
          let b_a = 0, a = this.matrix[v_in].values[i];

          if(a > 0)
          {
            b_a = b / a;
            if (!min) min = b_a;
          }

          if(a > 0 && b_a <= min)
          {
              min = b_a;
              v_out = i;
          }
      });

      this.vs[v_out] = this.matrix[v_in].name;

    return { out: v_out, in: v_in };
  }

  private calculate_in_out_min(): SimplexInOut
  {
      let max:number = 0,min:number = undefined, v_in:number = 0, v_out: number = 33;

      this.cj_zj.forEach((element, i) =>
      {
          if(!min) min = element;

          if (element <= min)
          {
            min  = element;
            v_in = i + 1;
          }
      });
      min = undefined;
      this.matrix[0].values.forEach((b, i) =>
      {
          let b_a = 0, a = this.matrix[v_in].values[i];

          if(a > 0)
          {
            b_a = b / a;
            if (!min) min = b_a;
          }

          if(a > 0 && b_a <= min)
          {
            min = b_a;
            v_out = i;
          }
      });

      return { out: v_out, in: v_in };
  }


  private calculate_reducers(v_in: number, v_out: number): SimplexReducer[]
  {
      let simplex_reducers: SimplexReducer[] = [];

      this.matrix[v_in].values.forEach((element, i) =>
      {
          if (i === v_out) {
            simplex_reducers.push({value: 1, multiply: 1});
            return;
          }
          let multiply = -1;
           simplex_reducers.push({value: element*multiply, multiply})
      });

      return simplex_reducers;
  }

  private sum_array(array: number[], array2: number[])
  {
      let sum = 0;
      array.forEach((element, i) =>
      {
          sum += element * array2[i];
      });
      return sum;
  }


  private is_sol_max()
  {
      for (let element of this.cj_zj)
      {
          if(element > 0)
            return false;
      }
      return true;
  }

  private is_sol_min()
  {
    for (let element of this.cj_zj)
    {
      if(element < 0)
        return false;
    }
    return true;
  }

  private init_solution_vars()
  {
      this.vs = this.restrictions.map((element, i ) => `s${i+1}` );
  }

  private clone(arr: any[]): any[]
  {
      return JSON.parse(JSON.stringify(arr));
  }
}
