import { SimplexDataApi, SimplexInOut, SimplexReducer, SimplexVar } from './simplex.class';
import { elementAt } from 'rxjs/operators';

export default class Simplex2Phases {

    cj: number[] = [];
    zj: number[] = [];
    vs: string[] = [];
    cj_zj: number[] = [];
    cb: number[] = [];
    matrix: SimplexVar[];
    n_vars: number;

    data: SimplexDataApi;

    constructor(data: SimplexDataApi)
    {
        this.n_vars = data.cj.length;
        this.data = data;
        this.transformData(data);
    }

    public result()
    {
        if (this.data.FO === 'max')
        {
            return this.Maximise();
        }else if (this.data.FO === 'min')
        {
            return this.Minimise();
        }
    }

    private Maximise()
    {
        let process:any[] = [];

        let phase = 1;

        for (let i = 0 ; i < 2 ; i++)
        {
            do {
                this.calculate();
                let v = i === 0 ? this.calculate_in_out_min() : this.calculate_in_out_max();

                process.push({matrix: this.clone(this.matrix), zj: [...this.zj], cj_zj: [...this.cj_zj], vs: [...this.vs], cb: [...this.cb], in_out: v, phase});

                if( ! v )
                  break;

                this.doOne(v);

                let reducers = this.calculate_reducers(v.in, v.out);

                this.doZero(reducers, v);

                this.cb[v.out] = this.cj[v.in - 1];
                this.vs[v.out] = this.matrix[v.in].name;

                if (phase)
                  phase = undefined;

            }while (!this.is_sol_max());

            phase = 2;

            if (i === 0)
            {
                this.transformToPhase2();
            }
          }
          const solution = this.getSolution();

        //this.printResult(process, solution);

          return { process, solution };
    }

    private Minimise()
    {
        let process:any[] = [];

        let phase = 1;

        for (let i = 0 ; i < 2 ; i++)
        {
            do {
              this.calculate();
              let v = this.calculate_in_out_min();

              process.push({matrix: this.clone(this.matrix), zj: [...this.zj], cj_zj: [...this.cj_zj], vs: [...this.vs], cb: [...this.cb], in_out: v, phase});

              if( ! v )
                break;

              this.doOne(v);

              let reducers = this.calculate_reducers(v.in, v.out);

              this.doZero(reducers, v);

              this.cb[v.out] = this.cj[v.in - 1];
              this.vs[v.out] = this.matrix[v.in].name;

              if (phase)
                phase = undefined;

            }while (!this.is_sol_min());

            phase = 2;

            if (i === 0)
            {
                this.transformToPhase2();
            }
        }
        const solution = this.getSolution();
        //this.printResult(process, solution);

        return { process, solution };
    }


    private transformToPhase2()
    {
        this.matrix = this.matrix.filter((element, i) => {
          if (element.name[0] !== 'a')
          {
            return element;
          }
        });

        let cont_s = 0;

        this.matrix.forEach((element) => {
          if (element.name[0] === 's')
            cont_s++;
        });

        this.cj = this.data.cj.concat(Array(cont_s).fill(0));



        this.vs.forEach((element, i) =>
        {
          this.cb[i] = this.cj[this.getPosition(element)];
        });

        this.zj = Array(this.matrix.length).fill(0);
        this.cj_zj = Array(this.cj.length).fill(0);
    }


    private transformData(data: SimplexDataApi)
    {
        this.matrix = [];

        for (let i = 0 ; i < data.restrictions.length; i++)
        {
            let r = data.restrictions[i];
            if (r.equal < 0)
            {
                r.x_n = r.x_n.map((element) => element * -1);
                r.equal = r.equal * -1;

                switch (r.symbol) {
                    case '<=':
                      r.symbol = '>=';
                      break;
                    case '>=':
                      r.symbol = '<=';
                      break;
                }
                data.restrictions[i] = r;
            }else if (r.equal === 0 && r.symbol === '>=')
            {
                r.x_n = r.x_n.map((element) => element * -1);
                r.symbol = '<=';
            }
        }

        let equals = data.restrictions.map((e) => e.equal);

        this.matrix.push({name: 'Sol', values:  equals});

        for (let i = 0 ; i < this.n_vars; i++ )
        {
          this.matrix.push({name: `x${i+1}`, values: []});
        }

        let cont_artificials = 0;

        for (let i in data.restrictions) {
            let r = data.restrictions[i];

            r.x_n.forEach((element, n) =>
            {
              this.matrix[n + 1].values.push(element);
            });

            let values_zero:number[] = Array(data.restrictions.length).fill(0);
            let a_vs = '';

            switch (r.symbol) {
                case '<=':

                  values_zero[i] = 1;
                  let sol_vs = `s${Number(i) + 1}`;

                  this.matrix.push({name: sol_vs, values: values_zero});

                  this.vs.push(sol_vs);
                  this.cb.push(0);
                  break;
                case '>=':
                  cont_artificials += 1;

                  let v1:number[] = [...values_zero];
                  let v2:number[] = [...values_zero];

                  v1[i] = -1;
                  v2[i] = 1;

                  a_vs = `a${cont_artificials}`;

                  this.matrix.push({ name: `s${Number(i) + 1}`, values: v1});
                  this.matrix.push({ name: a_vs, values: v2});

                  this.vs.push(a_vs);
                  this.cb.push(1);
                  break;

                case '=':
                    values_zero[i] = 1;
                    cont_artificials += 1;
                    a_vs = `a${cont_artificials}`;
                    this.matrix.push({ name: a_vs, values: values_zero});
                    this.vs.push(a_vs);
                    this.cb.push(1);
                  break;
          }

      }

      for (let i = 1; i < this.matrix.length; i++)
      {
          let name: string = this.matrix[i].name;
          if (name[0] === 'a')
            this.cj.push(1);
          else
            this.cj.push(0);
      }
      this.zj = Array(this.matrix.length - 1).fill(0);
      this.cj_zj = Array(this.matrix.length - 1 ).fill(0);

    }


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
        let max:number = 0,min:number = undefined, v_in:number = -1, v_out: number = 0;

        this.cj_zj.forEach((element, i) =>
        {
            if (element > max)
            {
              max  = element;
              v_in = i + 1;
            }
        });


        if(v_in === -1)
          return undefined;

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


    private calculate_in_out_min(): SimplexInOut
    {
        if (this.data.FO === 'max' && this.is_sol_max())
          return undefined;

        let max:number = 0,min:number = undefined, v_in:number = 0, v_out: number = 33;

        this.cj_zj.forEach((element, i) =>
        {

            if (element < 0 && Math.abs(element) > Math.abs(max))
            {
              max  = element;
              v_in = i + 1;
            }
        });

        if (v_in === 0)
          return undefined;

        max = 0;
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

        if (v_out > this.matrix.length)
            return undefined;

        return { out: v_out, in: v_in };
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

    private doOne(v: SimplexInOut)
    {
        let divide = this.matrix[ v.in ].values[ v.out ];

        this.matrix.forEach((element, i ) =>
        {
          element.values[ v.out ] = element.values[ v.out ] / divide;
        });
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

    private clone(arr: any[]): any[]
    {
      return JSON.parse(JSON.stringify(arr));
    }

    private printResult(process: any[], solution): void
    {
      process.forEach((element) =>
      {
        console.table(element.matrix);
        console.log("IN - OUT: ", element.in_out);
        console.log("V Solucion: ", element.vs);
        console.log("ZJ: ", element.zj);
        console.log("CJ-ZJ: ", element.cj_zj);
        console.log("FASE : ", element.phase);
        console.log("                          \n");
      });

      for (let va in solution)
      {
        console.log(va, ':', solution[va]);
      }

    }

    private getSolution()
    {
        let solution = {z: this.zj[0], xn: Array(this.n_vars).fill(0)};

        this.vs.forEach((element, i) =>
        {
          if(element[0] !== 'x')
            return;
          let pos = Number(element[1]) - 1;
          solution.xn[pos] = this.matrix[0].values[i];
        });

        return solution;
    }

    private getPosition(v: string)
    {
        return this.matrix.findIndex((element) =>
        {
            return element.name === v;
        }) - 1;
    }
}
