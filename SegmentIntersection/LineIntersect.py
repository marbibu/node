'''
python 2.7
Marek Bibulski 2015

Program implementuje algorytm do sprawdzania czy dwa odcinki na plaszczyznie,
przecinaja sie.

Pierwsze klikniecie na okno spowoduje utwrzenie pierwszego punktu odcinka,
Drugie... drugiego.

Dalsze klikniecia od nowa rozpoczna definiowanie punktow rysowanego odcinka.

Wyniki przeciecia sa wypsywane w konsoli
'''
from Tkinter import Tk,Canvas
class Window(object):
	def __init__(s):
		#Dane:
		s.__draw()
	def __draw(s):
		s.__master=Tk()
		s.__master.title("Line intersection")
		s.__master.geometry("%sx%s+%s+%s"%(600,600,0,0))
		s.__C=Canvas(s.__master,highlightthickness=0,bg="gray20")
		s.__C.pack(side="top",expand=1,fill="both")
	def __getC(s):
		return s.__C
	def loop(s):
		s.__master.update()
		s.__master.mainloop()
	C=property(fget=__getC)
class Point(object):
	__r=6
	def __init__(s,C,x,y):
		#Dane:
		s.__C=C
		s.__x,s.__y=x,y
		#Definicje:
		s.__draw()
	def __draw(s):
		s.__tag=s.__C.create_oval(-s.__r,-s.__r,s.__r,s.__r,fill="gray80",outline="")
		s.__C.move(s.__tag,s.__x,s.__y)
	def __getX(s):
		return s.__x
	def __getY(s):
		return s.__y
	def destroy(s):
		s.__C.delete(s.__tag)
	x=property(fget=__getX)
	y=property(fget=__getY)
class Line(object):
	def __init__(s,C,A,B):
		#Dane:
		s.__C=C
		s.__A,s.__B=A,B
		#Definicje:
		s.__draw()
	def __draw(s):
		s.__tag=s.__C.create_line(s.__A.x,s.__A.y,s.__B.x,s.__B.y,fill="gray80")
	def __getA(s):
		return s.__A
	def __getB(s):
		return s.__B
	def __update(s):
		s.__C.coords(s.__tag,s.__A.x,s.__A.y,s.__B.x,s.__B.y)
	def __setA(s,A):
		s.__A=A
		s.__update()
	def __setB(s,B):
		s.__B=B
		s.__update()
	def destroy(s):
		s.__C.delete(s.__tag)
	A=property(fget=__getA,fset=__setA)
	B=property(fget=__getB,fset=__setB)
class SegmentIntersection:
	def __det(s,A,B,C):
		return A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y)
	def __ccw(s,A,B,C):
		return (C.y-A.y)*(B.x-A.x) > (B.y-A.y)*(C.x-A.x)
	def intersect(s,A,B,C,D):
		if s.__ccw(A,C,D) != s.__ccw(B,C,D) and s.__ccw(A,B,C) != s.__ccw(A,B,D):
			print "przecina sie"
		else:
			print "nie przecina sie"
class LineCreator:
	def __init__(s,sesin,C,line):
		#Dane:
		s.__sesin=sesin
		s.__C=C
		s.__A,s.__B=None,None
		s.__line=line
		#Definicje:
		s.__bind()
	def __click(s,event):
		x,y=event.x,event.y
		s.putCoords(x,y)
	def putCoords(s,x,y):
		if s.__A==None and s.__B==None:
			s.__A=Point(s.__C,x,y)
		elif s.__A!=None and s.__B==None:
			s.__B=Point(s.__C,x,y)
			s.__line0=Line(s.__C,s.__A,s.__B)
			s.__sesin.intersect(s.__line.A,s.__line.B,s.__line0.A,s.__line0.B)
		elif s.__A!=None and s.__B!=None:
			s.__A.destroy()
			s.__B.destroy()
			s.__A=Point(s.__C,x,y)
			s.__B=None
			s.__line0.destroy()
		s.__C.update()

	def __bind(s):
		s.__C.bind("<1>",s.__click)
class Main():
	def __init__(s):
		#Okno z Canvasem
		win=Window()

		#Wspolrzedne punktow nieruchomego odcinka
		x1=100
		y1=300
		x2=400
		y2=100

		#Nieruchomy odcinek
		l1=Line(win.C,
			Point(win.C,x1,y1),
			Point(win.C,x2,y2)
			)

		#Linia, ktora bedzie tworzona po kliknieciu na Canvas
		#wykrywa przeciacia z linia zadana powyzej
		LineCreator(SegmentIntersection(),win.C,l1)

		win.loop()

Main()

